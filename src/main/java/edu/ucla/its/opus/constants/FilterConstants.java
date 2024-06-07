package edu.ucla.its.opus.constants;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import edu.ucla.its.opus.filter.OpusFilter;

/**
 * Constants file for Filtering purposes.
 */
public final class FilterConstants {

	 public static final String LOCAL_TESTUID = "380248675"; // opusadmin - Campus
//	 public static final String LOCAL_TESTUID = "180248676"; // opusapo - Campus
//	 public static final String LOCAL_TESTUID = "980331346"; // opusapostaff - Campus
//	 public static final String LOCAL_TESTUID = "980248677"; // opussa1 - Medicine
//	 public static final String LOCAL_TESTUID = "780248678"; // opussa2 - Division of Humanities
//	 public static final String LOCAL_TESTUID = "180248681"; // opusda1 - Public Policy
//	 public static final String LOCAL_TESTUID = "980248682"; // opusda2 - Dentistry: Diagnostic & Surgical Sciences
//	 public static final String LOCAL_TESTUID = "780248683"; // opusda3 - Dentistry: Advanced Prosthodontics: Prosthodontics
//	 public static final String LOCAL_TESTUID = "380248680"; // opusagsm - Management
//	 public static final String LOCAL_TESTUID = "580248679"; // opusdent - Dentistry: Diagnostic & Surgical Sciences
//	 public static final String LOCAL_TESTUID = "580248684"; // opusaa - Dentistry: Advanced Prosthodontics: Prosthodontics
//	 public static final String LOCAL_TESTUID = "480331344"; // opuslibrarysa - University Library
//	 public static final String LOCAL_TESTUID = "780331347"; // opusdean - School of Engineering
//	 public static final String LOCAL_TESTUID = "180331345"; // opusdivdean - Division of Physical Sciences
//	 public static final String LOCAL_TESTUID = "580331353"; // opuscap - Campus
//	 public static final String LOCAL_TESTUID = "580331348"; // opusvcap - Campus
//	 public static final String LOCAL_TESTUID = "380331349"; // opusvcedi - Campus
//	 public static final String LOCAL_TESTUID = "180331350"; // opusapb - Campus
//	 public static final String LOCAL_TESTUID = "980331351"; // opussenate - Campus
	 // UCLALOGONS WITH DUAL ROLES
//	 public static final String LOCAL_TESTUID = "780331352"; // opusmulti - Olive View Medicine AA, Orthopaedic Surgery DA
//	 public static final String LOCAL_TESTUID = "480161822"; // isistestidseven - DA (Family Medicine), DA (Anesthesiology)
//	 public static final String LOCAL_TESTUID = "680161821"; // isistestidsix - Oral and Maxillofacial Surgery Spec Admin, Orthodontics Spec Admin

	 public static final String	SHIB_UCLA_UNIVERSITY_ID			= "shibuclauniversityid";

	public static final String	SHIB_UCLA_LOGON					= "shibuclalogonid";

	public static final String	EMPTY_STRING					= "";

	public static final String	OPUS_ENVIRONMENT				= "opus.env";

	public static final String	OPUS_ENVIRONMENT_VALUE			= "dev";

	public static final Object	OPUS_TEST_ENVIRONMENT_VALUE		= "test";

	public static final String	OPUS_STAGE_ENVIRONMENT_VALUE	= "stage";

	public static final String	OPUS_PROD_ENVIRONMENT_VALUE		= "prod";
	
	public static final String	OPUS_TRAINING_ENVIRONMENT_VALUE	= "training";

	public static final String	HOST							= "http://localhost:8080";

	public static final String	LOCAL_HOST						= "http://localhost:8080";

	public static Properties readProperties() {

		Properties prop = new Properties();
		ClassLoader loader = OpusFilter.class.getClassLoader();

		try (InputStream in = loader.getResourceAsStream("config.properties")) {
			prop.load(in);

		} catch (IOException e) {
			e.printStackTrace();
		}
		return prop;
	}

}
