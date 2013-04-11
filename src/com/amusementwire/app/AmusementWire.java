
package com.amusementwire.app;

import android.os.Bundle;
import org.apache.cordova.*;

import com.amusementwire.app.R;

public class AmusementWire extends DroidGap
{
  	public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/index.html", 10000);
    }
}
