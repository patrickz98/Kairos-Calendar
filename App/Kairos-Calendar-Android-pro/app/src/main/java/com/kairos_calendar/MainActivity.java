package com.kairos_calendar;

//import com.google.zxing.integration.android.IntentIntegrator;

// me.dm7.barcodescanner.zxing

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;

import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity
{
    final static String LOGTAG = "MainActivity";
    final static int MY_PERMISSIONS_REQUEST_CAMERA = 1234;

    private WebView webView;
    private DataManager dataManager;
    private Handler mHandler;

    private QrCodeScaner qrScanner;
    private String intentString = "";

    private RelativeLayout layout;

    private final static int backgroundColor = 0xFF232323;

    @Override
    public void onCreate(Bundle state)
    {
        super.onCreate(state);

        checkPermisson();

        Log.d(LOGTAG, "onCreate()");

        dataManager = new DataManager(this);
        mHandler    = new Handler();
        qrScanner   = new QrCodeScaner(this);

        Intent intent = getIntent();
        String data = intent.getDataString();

        if (data != null)
        {
            intentString = data;
        }

        layout = new RelativeLayout(this);
        layout.setGravity(Gravity.BOTTOM);
        layout.setBackgroundColor(backgroundColor);

        createWebView();

        this.setContentView(layout);
    }

    @Override
    public void onResume()
    {
        super.onResume();

        Log.d(LOGTAG, "onResume()");

        qrScanner.resumeScanner();
    }

    @Override
    public void onPause()
    {
        super.onPause();

        Log.d(LOGTAG, "onPause()");

        qrScanner.pauseScanner();
    }

    @Override
    public void onBackPressed()
    {
        if (qrScanner.isActive())
        {
            Log.d(LOGTAG, "#### isActive");
            this.setContentView(layout);
            qrScanner.stopScanner();

            return;
        }

        webView.loadUrl("javascript:NativeInterface.androidBack()");
    }

    public void backPressed()
    {
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig)
    {
        super.onConfigurationChanged(newConfig);

        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE)
        {
            Log.d(LOGTAG, "orientationChange: LANDSCAPE");
            qrScanner.resizeScanner();
        }

        if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT)
        {
            Log.d(LOGTAG, "orientationChange: PORTRAIT");
            qrScanner.resizeScanner();
        }
    }

    private String jApp()
    {
        String encoded = "";

        try
        {
            InputStream raw = getResources().openRawResource(R.raw.app);

            byte[] buffer = new byte[ raw.available() ];
            raw.read(buffer);
            raw.close();

            encoded = Base64.encodeToString(buffer, Base64.NO_WRAP);
        }
        catch (IOException ex)
        {
            ex.printStackTrace();
        }

        return encoded;
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void createWebView()
    {
        webView = new WebView(this);
        webView.setPadding(0, 0, 0, 0);
        webView.setBackgroundColor(backgroundColor);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());

        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            RelativeLayout.LayoutParams.MATCH_PARENT);

        webView.setLayoutParams(params);

        WebAppInterface JInterface = new WebAppInterface(this, dataManager, mHandler);
        webView.addJavascriptInterface(JInterface, "Android");

        WebSettings settings = webView.getSettings();
        settings.setAppCachePath(getFilesDir().getPath() +"/cache");
        settings.setJavaScriptEnabled(true);
        settings.setAppCacheEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setDefaultTextEncodingName("utf-8");

        String html = "" +
            "<html>" +
                "<head>" +
                    "<script>" +
                        "(function()" +
                        "{" +
                            "var parent = document.head;" +
                            "var script = document.createElement('script');" +
                            "script.charset = 'utf-8';" +
                            "script.type = 'text/javascript';" +
                            // "script.innerHTML = window.atob('" + jApp() + "');" +
                            "script.innerHTML = decodeURIComponent(escape(window.atob('" + jApp() + "')));" +
                            "parent.appendChild(script)" +
                        "})()" +
                    "</script>" +
                "</head>" +
                "<body>" +
                    "<script>Main.main();</script>" +
                "</body>" +
            "</html>";

        webView.loadData(html, "text/html", "UTF-8");

        layout.addView(webView);
    }

    public void reload()
    {
        intentString = "";
        webView.reload();
    }

    public void openScanner()
    {
        qrScanner.startScanner();
    }

    public void qrResult(String json)
    {
        if (json == null) return;

        webView.loadUrl("javascript:NativeInterface.qrCallback('" + json + "')");
        this.setContentView(layout);
    }

    public void exeIntent()
    {
        if (intentString.equals("")) return;

        webView.loadUrl("javascript:NativeInterface.intent('" + intentString + "')");
    }

    public void share(String event)
    {
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, event);
        sendIntent.setType("text/plain");
        startActivity(sendIntent);
    }

    public void openMaps(String place)
    {
        String uri = "geo:0,0?q=" + place;
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
        this.startActivity(intent);
    }

    private void checkPermisson()
    {
        Log.d(LOGTAG, "checkPermisson");

        int compat = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA);

        if (compat == PackageManager.PERMISSION_GRANTED) return;


        // Should we show an explanation?
        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA))
        {
            // Show an expanation to the user *asynchronously* -- don't block
            // this thread waiting for the user's response! After the user
            // sees the explanation, try again to request the permission.
        }
        else
        {
            // No explanation needed, we can request the permission.
        }

        ActivityCompat.requestPermissions(
            this,
            new String[]{Manifest.permission.CAMERA},
            MY_PERMISSIONS_REQUEST_CAMERA);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults)
    {
        if (requestCode != MY_PERMISSIONS_REQUEST_CAMERA) return;

        // If request is cancelled, the result arrays are empty.
        if (grantResults.length > 0 && grantResults[ 0 ] == PackageManager.PERMISSION_GRANTED)
        {
            // permission was granted, yay! Do the
            // contacts-related task you need to do.

            Log.d(LOGTAG, "permission granted");
        }
        else
        {
            // permission denied, boo! Disable the
            // functionality that depends on this permission.

            Log.d(LOGTAG, "permission denied");

            // AlertDialog.Builder builder = new AlertDialog.Builder(this);
            // builder.setMessage("Pleace aloue");
            // builder.setCancelable(false);
            // builder.setPositiveButton("OK", null);

            // AlertDialog alert = builder.create();
            // alert.show();
        }
    }
}