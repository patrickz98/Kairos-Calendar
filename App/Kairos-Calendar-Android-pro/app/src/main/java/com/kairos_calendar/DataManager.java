package com.kairos_calendar;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Map;
import java.util.UUID;

public class DataManager
{
    public static final String LOGTAG = "DataManager";

    private SharedPreferences settings;
    private SharedPreferences.Editor editor;

    private SharedPreferences config_settings;
    private SharedPreferences.Editor config_editor;

    public DataManager(Context context)
    {
        settings = context.getSharedPreferences("CalendarData", Context.MODE_PRIVATE);
        editor   = settings.edit();

        config_settings = context.getSharedPreferences("CalendarConfig", Context.MODE_PRIVATE);
        config_editor   = config_settings.edit();
    }

    public void update(String uuid, String entry)
    {
        Log.d(LOGTAG, "update(" + uuid + ", " + entry + ")");

        editor.putString(uuid, entry);
        editor.apply();
    }

    public String add(String entry)
    {
        Log.d(LOGTAG, "add(" + entry + ")");

        String uuid = UUID.randomUUID().toString();

        editor.putString(uuid, entry);
        editor.apply();

        return uuid;
    }

    public void delete(String uuid)
    {
        Log.d(LOGTAG, "delete(" + uuid + ")");

        editor.remove(uuid);
        editor.commit();
        editor.apply();
    }

    public String events()
    {
        Log.d(LOGTAG, "events()");

        Map<String, ?> events = settings.getAll();

        JSONArray json = new JSONArray();

        for (Map.Entry<String, ?> entry : events.entrySet())
        {
            String uuid = entry.getKey();
            String value = entry.getValue().toString();

            JSONObject entryObj = null;

            try
            {
                entryObj = new JSONObject(value);
                entryObj.put("id", uuid);

//                if (entryObj.has("defaultCategory"))
//                {
//                    Log.d(LOGTAG, entryObj.toString());
//                    Log.d(LOGTAG, "key: " + uuid);
//                    delete("Config");
//                }
            }
            catch (Exception ex)
            {
                ex.printStackTrace();
            }

            if (entryObj == null) continue;

            json.put(entryObj);
        }

        Log.d(LOGTAG, "json: " + json.toString());

        return json.toString();
    }

    public String config()
    {
        String config = config_settings.getString("Config", "None");
        Log.d(LOGTAG, "config(): " + config);

        return config;
    }

    public void putConfig(String json)
    {
        Log.d(LOGTAG, "putConfig(): " + json);

        config_editor.putString("Config", json);
        config_editor.apply();
    }
}
