//
//  ShareExtensionDataPlugin.m
//  App
//
//  Created by 김민석 on 2023/09/17.
//
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(ShareExtensionDataPlugin, "ShareExtensionDataPlugin",
           CAP_PLUGIN_METHOD(read, CAPPluginReturnPromise);
)

