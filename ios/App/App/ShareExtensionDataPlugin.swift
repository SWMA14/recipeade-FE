//
//  ShareExtensionDataPlugin.swift
//  App
//
//  Created by 김민석 on 2023/09/17.
//

import Foundation
import Capacitor
import UniformTypeIdentifiers
import AuthenticationServices

class ShareData{
    var url: String
    var image: String
    
    init(url: String, image: String){
        self.url = url
        self.image = image
    }
}


@objc(ShareExtensionDataPlugin)
public class ShareExtensionDataPlugin: CAPPlugin {
    let userDefaults = UserDefaults(suiteName: "group.com.recipeade.svelte")
    
    @objc func read(_ call: CAPPluginCall){
            if let url = userDefaults?.string(forKey: "sharedURL"){
                if let imageData = userDefaults?.string(forKey: "sharedImage"){
                    let item :[String:String] = ["url" : url, "imageData" : imageData]
                    print("Item is " ,item)
                    call.resolve(["item" : item])
                }
                else{
                    let item:[String: String] = ["url" : url, "imageData" : "",]
                    print("Item is " ,item)
                    call.resolve(["item" : item])
                }
            }
        
        
        
    }

}

@objc(SignInWithApple)
public class SignInWithApple: CAPPlugin {

    @objc func authorize(_ call: CAPPluginCall) {
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = getRequestedScopes(from: call)
        request.state = call.getString("state")
        request.nonce = call.getString("nonce")

        let defaults = UserDefaults()
        defaults.setValue(call.callbackId, forKey: "callbackId")

        self.bridge?.saveCall(call)

        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.performRequests()
    }

    func getRequestedScopes(from call: CAPPluginCall) -> [ASAuthorization.Scope]? {
        var requestedScopes: [ASAuthorization.Scope] = []

        if let scopesStr = call.getString("scopes") {
            if scopesStr.contains("name") {
                requestedScopes.append(.fullName)
            }

            if scopesStr.contains("email") {
                requestedScopes.append(.email)
            }
        }

        if requestedScopes.count > 0 {
            return requestedScopes
        }

        return nil
    }
}

extension SignInWithApple: ASAuthorizationControllerDelegate {
    public func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential else { return }

        let defaults = UserDefaults()
        let id = defaults.string(forKey: "callbackId") ?? ""
        guard let call = self.bridge?.savedCall(withID: id) else {
            return
        }

        let result = [
            "response": [
                "user": appleIDCredential.user,
                "email": appleIDCredential.email,
                "givenName": appleIDCredential.fullName?.givenName,
                "familyName": appleIDCredential.fullName?.familyName,
                "identityToken": String(data: appleIDCredential.identityToken!, encoding: .utf8),
                "authorizationCode": String(data: appleIDCredential.authorizationCode!, encoding: .utf8)
            ]
        ]

        call.resolve(result)
        self.bridge?.releaseCall(call)
    }

    public func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        let defaults = UserDefaults()
        let id = defaults.string(forKey: "callbackId") ?? ""
        guard let call = self.bridge?.savedCall(withID: id) else {
            return
        }
        call.reject(error.localizedDescription)
        self.bridge?.releaseCall(call)
    }
}
