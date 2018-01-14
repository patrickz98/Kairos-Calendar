package com.kairos_calendar;

import android.util.Log;
import android.widget.Toast;

import com.google.zxing.Result;

import me.dm7.barcodescanner.zxing.ZXingScannerView;

public class QrCodeScaner implements ZXingScannerView.ResultHandler
{
    final static String LOGTAG = "QrCodeScaner";

    private MainActivity mainActivity;
    private static ZXingScannerView mScannerView;
    private boolean qrStart = false;

    QrCodeScaner(MainActivity mainActivity)
    {
        this.mainActivity = mainActivity;
    }

    public void startScanner()
    {
        Log.d(LOGTAG, "startScanner");

        mScannerView = new ZXingScannerView(mainActivity);

        mScannerView.setResultHandler(this);
        mScannerView.setAutoFocus(true);
        mScannerView.setFlash(false);

        mScannerView.startCamera();

        qrStart = true;
        mainActivity.setContentView(mScannerView);
    }

    public void nuke()
    {
        Log.d(LOGTAG, "nuke");

        if (mScannerView != null)
        {
            mScannerView.stopCamera();
            mScannerView = null;
        }
    }

    public void stopScanner()
    {
        Log.d(LOGTAG, "stopScanner");

        nuke();

        qrStart = false;
    }

    public void resumeScanner()
    {
        Log.d(LOGTAG, "resumeScanner");

        if (qrStart)
        {
            startScanner();
        }
    }

    public void pauseScanner()
    {
        Log.d(LOGTAG, "pauseScanner");

        if (qrStart)
        {
            nuke();
        }
    }

    public void resizeScanner()
    {
        Log.d(LOGTAG, "resizeScanner");

        if (qrStart)
        {
            nuke();
            startScanner();
        }
    }

    public boolean isActive()
    {
        return qrStart;
    }

    @Override
    public void handleResult(Result rawResult)
    {
        String qrResult = rawResult.getText();
        Toast.makeText(mainActivity, "Scan: " + qrResult, Toast.LENGTH_SHORT).show();

        Log.d(LOGTAG, "Scan: " + qrResult);

        stopScanner();

        mainActivity.qrResult(qrResult);
    }
}