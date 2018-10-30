package com.helplineapp;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.widget.Toast;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    private static final String[] permissions = {
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.WRITE_CONTACTS,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE};
    private static final int REQUEST_CODE_PERMISSION = 100;

    private boolean askForPermissions = true;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HelplineApp";
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (!hasPermissions()) {
            if (askForPermissions) {
                ActivityCompat.requestPermissions(this, permissions, REQUEST_CODE_PERMISSION);
            } else {
                Toast.makeText(this, "Required permissions have not been granted", Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }

    private boolean hasPermissions() {
        if (Build.VERSION.SDK_INT < 23) {
            return true;
        }

        for (int i = 0; i <= permissions.length - 1; i++) {
            if (ActivityCompat.checkSelfPermission(this, permissions[i]) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode != REQUEST_CODE_PERMISSION) {
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
            return;
        }

        if (!hasPermissions()) {
            if (askForPermissions) {
                askForPermissions = false;
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", getPackageName(), null);
                intent.setData(uri);
                startActivity(intent);
                Toast.makeText(this,"Please grant required permissions", Toast.LENGTH_LONG).show();
                return;
            }

            finish();
        }
    }

}
