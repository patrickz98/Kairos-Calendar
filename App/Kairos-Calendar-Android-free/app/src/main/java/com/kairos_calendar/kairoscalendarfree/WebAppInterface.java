package com.kairos_calendar.kairoscalendarfree;

import android.os.Handler;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface
{
    private final static String LOGTAG = "WebAppInterface";

    private MainActivity mainActivity;
    private DataManager dataManager;
    private Handler mHandler;

    WebAppInterface(MainActivity main, DataManager dataManager, Handler mHandler)
    {
        this.mainActivity = main;
        this.dataManager  = dataManager;
        this.mHandler     = mHandler;
    }

    @JavascriptInterface
    public void showToast(String toast)
    {
        Toast.makeText(mainActivity, toast, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public void openScanner()
    {
        Log.d(LOGTAG, "openScanner");

        Runnable startQrRunnable = new Runnable()
        {
            @Override
            public void run()
            {
                mainActivity.openScanner();
            }
        };

        mHandler.post(startQrRunnable);
    }

    @JavascriptInterface
    public void reload()
    {
        Log.d(LOGTAG, "reload");

        Runnable startQrRunnable = new Runnable()
        {
            @Override
            public void run()
            {
                mainActivity.reload();
            }
        };

        mHandler.post(startQrRunnable);
    }

    @JavascriptInterface
    public void openMaps(final String place)
    {
        Log.d(LOGTAG, "openMaps: " + place);

        Runnable startQrRunnable = new Runnable()
        {
            @Override
            public void run()
            {
                mainActivity.openMaps(place);
            }
        };

        mHandler.post(startQrRunnable);
    }

    @JavascriptInterface
    public String events()
    {
        return dataManager.events();
    }

    @JavascriptInterface
    public String add(String entry)
    {
        return dataManager.add(entry);
    }

    @JavascriptInterface
    public void delete(String uuid)
    {
        dataManager.delete(uuid);
    }

    @JavascriptInterface
    public void update(String uuid, String entry)
    {
        dataManager.update(uuid, entry);
    }

    @JavascriptInterface
    public String config()
    {
        return dataManager.config();
    }

    @JavascriptInterface
    public void putConfig(String json)
    {
        dataManager.putConfig(json);
    }

    @JavascriptInterface
    public void exeIntent()
    {
        Log.d(LOGTAG, "exeIntent");

        Runnable intent = new Runnable()
        {
            @Override
            public void run()
            {
                mainActivity.exeIntent();
            }
        };

        mHandler.post(intent);
    }

    @JavascriptInterface
    public void share(final String event)
    {
        Log.d(LOGTAG, "share: " + event);

        Runnable intent = new Runnable()
        {
            @Override
            public void run()
            {
                mainActivity.share(event);
            }
        };

        mHandler.post(intent);
    }

    @JavascriptInterface
    public void onBackPressed()
    {
        Log.d(LOGTAG, "onBackPressed");

        Runnable run = new Runnable()
        {
            @Override
            public void run()
            {
                mainActivity.backPressed();
            }
        };

        mHandler.post(run);
    }
}
