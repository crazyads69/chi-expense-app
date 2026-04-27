package com.chiexpense.app.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class ChiExpenseWidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val PREFS_NAME = "widget_data"

    override fun getName(): String {
        return "ChiExpenseWidgetModule"
    }

    @ReactMethod
    fun setWidgetData(data: ReadableMap, promise: Promise) {
        try {
            val context = reactApplicationContext
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val editor = prefs.edit()

            if (data.hasKey("monthLabel")) {
                editor.putString("widget_monthLabel", data.getString("monthLabel"))
            }
            if (data.hasKey("total")) {
                editor.putLong("widget_total", data.getString("total")?.toLong() ?: 0L)
            }
            if (data.hasKey("currency")) {
                editor.putString("widget_currency", data.getString("currency"))
            }
            if (data.hasKey("count")) {
                editor.putInt("widget_count", data.getString("count")?.toInt() ?: 0)
            }

            editor.apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", e.message)
        }
    }

    @ReactMethod
    fun requestWidgetUpdate(promise: Promise) {
        try {
            val context = reactApplicationContext
            val intent = Intent(context, ChiExpenseWidgetProvider::class.java)
            intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val component = ComponentName(context, ChiExpenseWidgetProvider::class.java)
            val ids = AppWidgetManager.getInstance(context).getAppWidgetIds(component)
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
            context.sendBroadcast(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", e.message)
        }
    }
}
