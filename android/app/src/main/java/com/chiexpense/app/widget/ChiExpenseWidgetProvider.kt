package com.chiexpense.app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.widget.RemoteViews
import com.chiexpense.app.R
import java.text.NumberFormat
import java.util.Locale

class ChiExpenseWidgetProvider : AppWidgetProvider() {

    companion object {
        private const val PREFS_NAME = "widget_data"
        private const val KEY_MONTH = "widget_monthLabel"
        private const val KEY_TOTAL = "widget_total"
        private const val KEY_CURRENCY = "widget_currency"
        private const val KEY_COUNT = "widget_count"
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val month = prefs.getString(KEY_MONTH, "Current Month") ?: "Current Month"
        val total = prefs.getLong(KEY_TOTAL, 0)
        val currency = prefs.getString(KEY_CURRENCY, "VND") ?: "VND"
        val count = prefs.getInt(KEY_COUNT, 0)

        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId, month, total, currency, count)
        }
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int,
        month: String,
        total: Long,
        currency: String,
        count: Int
    ) {
        val views = RemoteViews(context.packageName, R.layout.widget_layout)

        val formatter = NumberFormat.getNumberInstance(Locale("vi", "VN"))
        val formattedTotal = formatter.format(total)

        views.setTextViewText(R.id.widget_title, "Monthly Spending")
        views.setTextViewText(R.id.widget_amount, "$formattedTotal $currency")
        views.setTextViewText(R.id.widget_month, "$month • $count transactions")

        // Deep-link to dashboard
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("chi-expense://dashboard"))
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}
