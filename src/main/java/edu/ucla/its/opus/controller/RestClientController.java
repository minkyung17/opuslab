package edu.ucla.its.opus.controller;
 
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * This class contains API for Opus REST client
 */
@RestController
@RequestMapping(value = "/common")
public class RestClientController {

	//logger
	private final Logger LOG = LoggerFactory.getLogger(RestClientController.class);
	
    @RequestMapping(value = "/call", method = RequestMethod.GET)
    @ResponseBody
    public List<Object> callRestApi(HttpServletRequest request) throws Exception {

	Object authDataObj = request.getSession().getAttribute("authData");
	Object userDataObj = request.getSession().getAttribute("userData");
	Object globalDataObj = request.getSession().getAttribute("globalData");
	List<Object> list = new ArrayList<Object>();
	list.add(authDataObj);
	list.add(userDataObj);
	list.add(globalDataObj);
	LOG.info("Returning Data" + DateTime.now());
	return list;

    }
    
    @RequestMapping(value = "/role", method = RequestMethod.GET)
    @ResponseBody
    public Object callForUserData(HttpServletRequest request) throws Exception {

	Object userDataObj = request.getSession().getAttribute("userData");
	LOG.info("Returning UserData Data" + DateTime.now());
	return userDataObj;

    }
}
