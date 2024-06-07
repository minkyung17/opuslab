package edu.ucla.its.opus.controller;

import java.util.Properties;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.ucla.its.opus.constants.FilterConstants;
import edu.ucla.its.opus.exception.OpusClientException;

/**
 * This class contains API for Opus dashboard  
 */
@Controller
public class DashboardController {

	private static final Logger DASHBOARDLOGGER = LoggerFactory.getLogger(DashboardController.class);

	@RequestMapping("/dashboard")
	@ResponseBody
	public String dashboard(@RequestParam("dashboardRole") String dashboardRole, HttpServletRequest request)
			throws Exception {

		try {
			DASHBOARDLOGGER.info("Inside Dashboard :: getAdminRole " + dashboardRole);
			return dashboardRole;
		} catch (RuntimeException rte) {
			DASHBOARDLOGGER.error(rte.getMessage());
			throw new OpusClientException("DashBoard Role is incorrect.", rte);
		}
	}

	@RequestMapping(value = "/dashboardexit", method = RequestMethod.GET)
	@ResponseBody
	public String dashboardexit(@RequestParam("adminOpusId") String adminOpusId,
			@RequestParam("restUrl") String restUrl, HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		DASHBOARDLOGGER.info("Inside Dashboard Exit:: getAdminRole " + adminOpusId );
		HttpSession session = request.getSession();
		//String url = request.getRequestURL().toString();
		//String base = url.substring(0, url.length() - request.getRequestURI().length());
		String environment = System.getProperty(FilterConstants.OPUS_ENVIRONMENT);
		session.removeAttribute("userData");
		session.removeAttribute("aData");
		String appShib = "-application.shibboleth";

		HttpSession sessIfAny = request.getSession(false);
		if (sessIfAny != null) {
			sessIfAny.invalidate();
		}

		try {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (int i = 0; i < cookies.length; i++) {

					cookies[i].setValue("");
					cookies[i].setPath("/");
					cookies[i].setMaxAge(0);
					cookies[i].setSecure(true);
					response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

					// prevent caching at the proxy server
					response.setDateHeader("Expires", 0);
					response.addHeader("Pragma", "no-cache");
					response.addCookie(cookies[i]);
				}
			}
			//RestTemplate restTemplate = new RestTemplate();

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			//String postJson = adminOpusId;
			//HttpEntity<String> reqEntity = new HttpEntity<String>(postJson, headers);
			//int sucessFlag = restTemplate.postForObject(base + restUrl, reqEntity, Integer.class);

			DASHBOARDLOGGER.info("Inside Dashboard :: getAdminOpusId " + adminOpusId );
			String URL = null;
			Properties property = FilterConstants.readProperties();
	 		//for Stage and Production environment
			if (environment.equals(FilterConstants.OPUS_STAGE_ENVIRONMENT_VALUE) ||
					environment.equals(FilterConstants.OPUS_PROD_ENVIRONMENT_VALUE)) {
				URL = property.getProperty(environment + "-application.host") + "/Shibboleth.sso/Logout?return="
						+ property.getProperty(environment + appShib) + "/shibboleth-idp/Logout";
			} else {
				URL = property.getProperty(environment + "-application.host") + "/Shibboleth.sso/Logout?return="
						+ property.getProperty(environment + appShib) + "/shibboleth-idp/Logout";
			}
			DASHBOARDLOGGER.info("Environment " + environment + " URL " + URL);
			return URL;
		} catch (NumberFormatException e) {
			DASHBOARDLOGGER.error(e.getMessage());
			throw new OpusClientException("Number Format Exception", e);
		} catch (RuntimeException rte) {
			DASHBOARDLOGGER.error(rte.getMessage());
			rte.printStackTrace();
			throw new OpusClientException("DashBoard Role is incorrect.", rte);
		}

	}
	
	@RequestMapping(value = "/connectToByC", method = RequestMethod.GET)
	@ResponseBody
	public String connectToByC(HttpServletRequest request)
			throws Exception {

		DASHBOARDLOGGER.info("getting ByC URL " );
		Properties property = FilterConstants.readProperties();
		String environment = System.getProperty(FilterConstants.OPUS_ENVIRONMENT);
		String URL = property.getProperty(environment + "-rest.byc.sso");
			
		DASHBOARDLOGGER.info("Environment :" + System.getProperty(FilterConstants.OPUS_ENVIRONMENT) + " URL: " + URL);
		return URL;
		
	}

}
