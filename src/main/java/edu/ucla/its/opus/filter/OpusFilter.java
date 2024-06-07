package edu.ucla.its.opus.filter;

import java.io.IOException; 
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import org.springframework.security.oauth2.provider.error.OAuth2AuthenticationEntryPoint;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;

import edu.ucla.its.opus.constants.FilterConstants;
import edu.ucla.its.opus.domain.AuthData;

/**
 * This filter class pre-process Opus client requests before the it is sent out 
 */
public class OpusFilter implements Filter {

	private final Logger LOG = LoggerFactory.getLogger(OpusFilter.class);

	public void init(FilterConfig filterConfig) throws ServletException {

	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		HttpSession session = req.getSession();
		String uid = (String) req.getHeader(FilterConstants.SHIB_UCLA_UNIVERSITY_ID);
		String uclaLogon = (String) req.getHeader(FilterConstants.SHIB_UCLA_LOGON);
		HashMap<String, String> postJson = new HashMap<String, String>();
		String environment = System.getProperty(FilterConstants.OPUS_ENVIRONMENT);
		//LOG.debug("1. Valid Shibboleth Attributes UID :: " + uid + " UCLA Logon Id :: " + uclaLogon);
		String base = null;
		String url = req.getRequestURL().toString();
		//String dnsName = url.substring(0, url.length() - req.getRequestURI().length());
		String dnsName = getDnsName(environment);
		LOG.info("Domain Name: " + dnsName);
		if (environment.equalsIgnoreCase("local")) {
			base = FilterConstants.LOCAL_HOST;
		} else {
			base = FilterConstants.HOST;
		}
		
		//AuthData authData = null;
//		if(req.getSession().getAttribute("sessionData") != null) { 
//		 List<Object> list = (List<Object>) req.getSession().getAttribute("sessionData");
//		 authData = (AuthData) list.get(0);
//		}
		
		Object object = req.getSession().getAttribute("authData");
		AuthData authData = (AuthData) object;
		if (authData != null) {
			LOG.info("AuthData Session:" +authData.getAccess_token());
		}

		if (authData == null || ((new Date(System.currentTimeMillis())).compareTo(authData.getExpires_in()) == 1)) {

			LOG.info("Creating New Session Access Token for Shibboleth Attributes");
			Properties property = FilterConstants.readProperties();
			String grant_type = property.getProperty("grant_type");
			String client_id = property.getProperty("client_id");
			String client_secret = property.getProperty("client_secret");
			String username = property.getProperty("username");
			String password = property.getProperty("password");
			try {				
				if (environment.equalsIgnoreCase("local")) {
					//LOG.info("Manual Assignment of UID :: " + FilterConstants.LOCAL_TESTUID + " Environment :: "
					//	+ environment);
					postJson.put("uid", FilterConstants.LOCAL_TESTUID);
					postJson.put("uclaLogon", uclaLogon);
				} else if ((uid != null && !uid.equals(FilterConstants.EMPTY_STRING))
						|| (uclaLogon != null && !uclaLogon.equals(FilterConstants.EMPTY_STRING))) {
					postJson.put("uid", uid);
					postJson.put("uclaLogon", uclaLogon);
				} else {
					LOG.error("Error-ed - No Object Created - Environment :: " + environment);
					res.sendRedirect(dnsName + "/access-error.shtml");
					return;
				}
			} catch (Exception e) {
				LOG.error("OpusPerson is Invalid. UCLA-LOGON :: " + uclaLogon + " UID :: " + uid + e.getMessage());
				e.printStackTrace();
				res.sendRedirect(dnsName + "/access-error.shtml");
				return;
			}

			AuthData aData = new AuthData();
			//List<Object> sessionData = new ArrayList<Object>();
			try {
				ResourceOwnerPasswordResourceDetails resourceDetails = new ResourceOwnerPasswordResourceDetails();
				resourceDetails.setClientSecret(client_secret);
				resourceDetails.setClientId(client_id);
				resourceDetails.setGrantType(grant_type);
				resourceDetails.setUsername(username);
				resourceDetails.setPassword(password);
				resourceDetails.setAccessTokenUri(base + "/restServices/oauth/token");

				OAuth2RestTemplate oAuthRestTemplate = new OAuth2RestTemplate(resourceDetails);
				oAuthRestTemplate.setMessageConverters(getMessageConverters());

				LOG.info("Access Token:" + oAuthRestTemplate.getAccessToken());
				aData.setAccess_token(oAuthRestTemplate.getAccessToken().getValue());
				aData.setExpires_in(oAuthRestTemplate.getAccessToken().getExpiration());
				aData.setRefresh_token(oAuthRestTemplate.getAccessToken().getRefreshToken().getValue());
				aData.setToken_type(oAuthRestTemplate.getAccessToken().getTokenType());
				session.setAttribute("authData", aData);
				//sessionData.add(aData);

				HttpHeaders headers = new HttpHeaders();
				headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
				headers.setContentType(MediaType.APPLICATION_JSON);

				// POST Method
				HttpEntity<HashMap<String, String>> reqEntity =
						new HttpEntity<HashMap<String, String>>(postJson, headers);
				String postUri = base + "/restServices/rest/access/getLoggedInUserData";
				String getUri = base + "/restServices/rest/activecase/getApplicationData";
				LOG.info("Requesting info from server " + DateTime.now());
				HashMap<String, Object> userData = oAuthRestTemplate.postForObject(postUri, reqEntity, HashMap.class);
				session.setAttribute("userData", userData);
				//sessionData.add(userData);
				HashMap<String, Object> globalData = oAuthRestTemplate.getForObject(getUri, HashMap.class);
				session.setAttribute("globalData", globalData);
				//sessionData.add(globalData);
				//session.setAttribute("sessionData", sessionData);
				LOG.info("Setting the app data in session" + DateTime.now());
			} catch (Exception e) {
				LOG.error("UID/uclaLogon doesnt have an opusId in db :: " + uclaLogon + " UID :: " + uid);
				e.printStackTrace();
				session.setAttribute("authData", null);
				res.sendRedirect(dnsName + "/access-error.shtml");
				return;
			}
			//LOG.debug("Date:" + new Date(System.currentTimeMillis()));
			//LOG.debug("Data:" + aData.getAccess_token());
		}
		chain.doFilter(request, response);

	}
	
	private String getDnsName(String env) {
		String dnsName = FilterConstants.HOST;
		Properties property = FilterConstants.readProperties();
		if (env.equals(FilterConstants.OPUS_ENVIRONMENT_VALUE)) {
			dnsName = property.getProperty("dev-application.host");
		} else if (env.equals(FilterConstants.OPUS_TEST_ENVIRONMENT_VALUE)) {
			dnsName = property.getProperty("test-application.host");
		} else if (env.equals(FilterConstants.OPUS_STAGE_ENVIRONMENT_VALUE)) {
			dnsName = property.getProperty("stage-application.host");
		} else if (env.equals(FilterConstants.OPUS_TRAINING_ENVIRONMENT_VALUE)) {
			dnsName = property.getProperty("training-application.host");
		} else if (env.equals(FilterConstants.OPUS_PROD_ENVIRONMENT_VALUE)) {
			dnsName = property.getProperty("prod-application.host");
		}		
		return dnsName;
	}
	private static List<HttpMessageConverter<?>> getMessageConverters() {

		List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>();
		converters.add(new MappingJackson2HttpMessageConverter());
		return converters;
	}

	public void destroy() {

	}

}
