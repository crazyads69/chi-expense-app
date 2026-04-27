import Foundation
import WidgetKit

@objc(ChiExpenseWidgetModule)
class ChiExpenseWidgetModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "ChiExpenseWidgetModule"
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc
    func setWidgetData(_ data: [String: String], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let defaults = UserDefaults(suiteName: "group.com.chiexpense.app") else {
            reject("WIDGET_ERROR", "App Group not accessible", nil)
            return
        }

        if let monthLabel = data["monthLabel"] {
            defaults.set(monthLabel, forKey: "widget_monthLabel")
        }
        if let total = data["total"], let totalVal = Double(total) {
            defaults.set(totalVal, forKey: "widget_total")
        }
        if let currency = data["currency"] {
            defaults.set(currency, forKey: "widget_currency")
        }
        if let count = data["count"], let countVal = Int(count) {
            defaults.set(countVal, forKey: "widget_count")
        }
        if let trend = data["trend"] {
            defaults.set(trend, forKey: "widget_trend")
        }

        defaults.synchronize()
        resolve(true)
    }

    @objc
    func reloadAllTimelines(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        resolve(true)
    }
}
