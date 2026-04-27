#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ChiExpenseWidgetModule, NSObject)

RCT_EXTERN_METHOD(setWidgetData:(NSDictionary *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reloadAllTimelines:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
