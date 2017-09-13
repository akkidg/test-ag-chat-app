# SoWhatORB AR Library for Marker Detection for Android

We have been trying to build a marker based AR library on the lines of Vuforia/Wikitude for Android platform. The most reliable open source algorithm we found was ORB on OpenCV platform. 
When we ran ORB (in Java) on Android, it reduced frame rates from 30 to 5/6. It also slowed down the camera. So we thought to go one layer below from java to c++.  We compiled ORB in a .SO file and created another jar library to access the functions in .SO file. 
With this approach, we could store 50 markers in the local storage and the algorithm could detect each of them within 1-2 seconds, without impacting camera speed even the slightest. 

It was quite a pain to get to this point. Moreover, we found out that many people who are using ORB on Android are facing the exact same issue without any concrete solution. Hence we thought to share the project on github for everyone to use. 

This project is still under development.

**Our next challenges are**
  1. To improve upon ORB algorithm to make its object detection better 
  2. To create a standard rating system to determine how good a marker is (similar to Vuforia).
 
We are open to suggestions & feedback from everyone. 

# How do I use this library?

There are two parts to this project. 
  1.	To generate Marker Dataset file from web dashboard
  2.	Actual integration of this library to your Android project. 

**Part 1:**

Generate ‘Marker Dataset’ file using the following link. Upload all of your markers at once, a single file with the name sowhatorb_marker_dataset.yml will be generated. This file contains features of all the markers you uploaded. 

Link - 

Put sowhatorb_marker_dataset.yml file in any folder in your phone. Make sure you update that path later in your Android project. 

**Part 2:**
Let’s see how to integrate library to your Android project.

You can clone this repository and run it on device to see Sample demo app with predefined marker images.
Scan One of marker images to see basic AR experience. 
We're not providing any rendering mechanism with this demo, you have to integrate it on
your on choice like Opengl etc.

**To integrate it in your project follow these steps** 

Download bundle of jars from here

Put those in your app - libs folder then Rebuild your project

Do not forget to add below permissions in manifest if already not present

   <uses-permission android:name="android.permission.CAMERA"/>
		
	 <uses-feature android:name="android.hardware.camera"/>
		
	 <uses-feature android:name="android.hardware.camera.autofocus" />

	 <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
		
**Compatibility** 

Android SDK: ArLibrary requires a minimum API level of 15.

Make below changes in your app gradle file
```
def CV_SDK_DIR = '../../..'
def NATIVE_LIB_DIR = 'build/lib'

android{
	
  defaultConfig {
      ...
      ...
      targetSdkVersion 22	 // set targetSdkVersion to 22
   }
   
  buildTypes {
        release {
              ndk {
                abiFilters "armeabi-v7a"
              }
              // proguard file details
        }
        debug {
              ndk {
                abiFilters "armeabi-v7a"
              }
              // proguard file details
        }
   }

  sourceSets.main {
	jni.srcDirs = []
	jniLibs.srcDirs "$CV_SDK_DIR/$NATIVE_LIB_DIR/"
   }		
}
dependencies {
   ...
   compile 'com.android.support:design:26.+'
   ...
}
```    

Initialize Ar Tracker instance in your Activity
``` 
      /*
      * Implement TrackerSessionController interface in your activity.
      * This interface is observable interface which returns target name if found in camera.
      */

public class ArActivity extends AppCompatActivity implements TrackerSessionController {

	/*
	* Marker file path from local storage
	*/
	private static String filePath = "/storage/emulated/0/<YOUR_STORAGE_FOLDER>/sowhatorb_marker_dataset.yml";

	/*
	* AR Tracker instance
	*/
	private InitializeAR mInitializeAR;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_ar);
		
		mInitializeAR = new InitializeAR(this,filePath,this);
	}

	/*
	* De-initialize AR Tracker instance
	*/
	@Override
	protected void onResume() {
		super.onResume();
		mInitializeAR.resumeAR();
	}

	/*
	* Initialize AR Tracker instance
	*/
	@Override
	protected void onPause() {
		super.onPause();
		mInitializeAR.pauseAR();
	}

	@Override
	public void onTrackingResult(String targetName) {
		System.out.println("Target Name " + targetName);
	}
}
``` 
