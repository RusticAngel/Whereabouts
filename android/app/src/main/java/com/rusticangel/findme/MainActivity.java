package com.rusticangel.findme;

import android.os.Bundle;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {

    private static final long[] RETRY_DELAYS_MS = { 3000L, 6000L, 10000L };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Bridge bridge = getBridge();
        if (bridge != null) {
            bridge.setWebViewClient(new RetryingBridgeWebViewClient(bridge));
        }
    }

    private static class RetryingBridgeWebViewClient extends BridgeWebViewClient {

        private final Bridge bridge;
        private int retries = 0;

        RetryingBridgeWebViewClient(Bridge bridge) {
            super(bridge);
            this.bridge = bridge;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            retries = 0;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            retry(view, request);
        }

        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
            super.onReceivedHttpError(view, request, errorResponse);
            retry(view, request);
        }

        private void retry(WebView view, WebResourceRequest request) {
            if (!request.isForMainFrame() || retries >= RETRY_DELAYS_MS.length) {
                return;
            }
            final long delay = RETRY_DELAYS_MS[retries];
            retries++;
            final String url = view.getUrl();
            view.postDelayed(() -> {
                if (url != null && !url.isEmpty()) {
                    view.loadUrl(url);
                } else {
                    view.loadUrl(bridge.getAppUrl());
                }
            }, delay);
        }
    }
}