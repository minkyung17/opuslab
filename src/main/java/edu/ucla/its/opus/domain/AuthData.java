package edu.ucla.its.opus.domain;

import java.util.Date;

/**
 * This class represents authorization object
 */
public class AuthData {

    private String access_token;
    private Date   expires_in;
    private String refresh_token;
    private String token_type;
    private long   creationTime;
    private String uid;
    private String uclaLogon;

    public String getAccess_token() {

	return access_token;
    }

    public void setAccess_token(String access_token) {

	this.access_token = access_token;
    }

    public Date getExpires_in() {

	return expires_in;
    }

    public void setExpires_in(Date expires_in) {

	this.expires_in = expires_in;
    }

    public String getRefresh_token() {

	return refresh_token;
    }

    public void setRefresh_token(String refresh_token) {

	this.refresh_token = refresh_token;
    }

    public String getToken_type() {

	return token_type;
    }

    public void setToken_type(String token_type) {

	this.token_type = token_type;
    }

    public long getCreationTime() {

	return creationTime;
    }

    public void setCreationTime(long creationTime) {

	this.creationTime = creationTime;
    }

	/**
	 * @return the uid
	 */
	public final String getUid() {
		return uid;
	}

	/**
	 * @param uid the uid to set
	 */
	public final void setUid(String uid) {
		this.uid = uid;
	}

	/**
	 * @return the uclaLogon
	 */
	public final String getUclaLogon() {
		return uclaLogon;
	}

	/**
	 * @param uclaLogon the uclaLogon to set
	 */
	public final void setUclaLogon(String uclaLogon) {
		this.uclaLogon = uclaLogon;
	}

}
