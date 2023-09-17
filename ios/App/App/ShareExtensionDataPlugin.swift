//
//  ShareExtensionDataPlugin.swift
//  App
//
//  Created by 김민석 on 2023/09/17.
//

import Foundation
import Capacitor
import UniformTypeIdentifiers

class ShareData{
    var url: String
    var image: String
    var text: String
    
    init(url: String, image: String,text: String){
        self.url = url
        self.image = image
        self.text = text
    }
}


@objc(ShareExtensionDataPlugin)
public class ShareExtensionDataPlugin: CAPPlugin {
    let userDefaults = UserDefaults(suiteName: "group.com.recipeade.svelte")
    
    
    @objc func read(_ call: CAPPluginCall){
        
        if let sharedText = userDefaults?.string(forKey: "sharedText"){
            if let url = userDefaults?.string(forKey: "sharedURL"){
                if let imageData = userDefaults?.string(forKey: "sharedImage"){
                    let item :[String:String] = ["url" : url, "imageData" : imageData,"text" : sharedText]
                    call.resolve(["item" : item])
                }
                else{
                    let item:[String: String] = ["url" : url, "imageData" : "", "text" : sharedText]
                    call.resolve(["item" : item])
                }
            }
        }
        
        
    }

}
