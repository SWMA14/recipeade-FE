//
//  ShareViewController.swift
//  Share
//
//  Created by 김민석 on 2023/09/17.
//

import UIKit
import Social

class ShareViewController: SLComposeServiceViewController {
    var sharedURL: URL?
    var sharedImage: UIImage?
    var sharedText: String?
    
    override func isContentValid() -> Bool {
        // Do validation of contentText and/or NSExtensionContext attachments here
        return true
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem
        let itemProvider = extensionItem?.attachments?.first as? NSItemProvider
        
        if itemProvider?.hasItemConformingToTypeIdentifier("public.url") == true {
            itemProvider?.loadItem(forTypeIdentifier: "public.url", options: nil) { [weak self] (url, error) in
                if let shareURL = url as? URL {
                    self?.sharedURL = shareURL
                }
            }
        }
        
        if itemProvider?.hasItemConformingToTypeIdentifier("public.image") == true {
            itemProvider?.loadItem(forTypeIdentifier: "public.image", options: nil) { [weak self] (image, error) in
                if let shareImage = image as? UIImage {
                    self?.sharedImage = shareImage
                }
            }
        }

    }

    override func didSelectPost() {
        // This is called after the user selects Post. Do the upload of contentText and/or NSExtensionContext attachments.
        
        // Inform the host that we're done, so it un-blocks its UI. Note: Alternatively you could call super's -didSelectPost, which will similarly complete the extension context.
        // Save data to UserDefaults with App Group identifier
        let userDefaults = UserDefaults(suiteName: "group.com.recipeade.svelte")
        
        if let content = textView.text{
            userDefaults?.set(content, forKey: "sharedText")
        }
        
        userDefaults?.set(sharedURL?.absoluteString, forKey: "sharedURL")
        
        // Convert UIImage to Data for saving in UserDefaults
        if let image = sharedImage {
            if let imageData = image.jpegData(compressionQuality: 1.0) {
                let base64String = imageData.base64EncodedString()
                userDefaults?.set(base64String, forKey: "sharedImage")
            }
        }
        
        // End the request by calling completeRequestReturningItems(_:), passing the items that were initially supplied.
        self.extensionContext!.completeRequest(returningItems: [], completionHandler:nil)
    }

    override func configurationItems() -> [Any]! {
        // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
        return []
    }

}

//import UIKit
//import Social
//import MobileCoreServices
//
//class ShareViewController: UIViewController {
//    @IBOutlet weak var imageView: UIImageView!
//    @IBOutlet weak var textView: UITextView!
//
//        override func viewDidLoad() {
//            let extensionItems = extensionContext?.inputItems as! [NSExtensionItem]
//
//            for extensionItem in extensionItems {
//                if let itemProviders = extensionItem.attachments as? [NSItemProvider] {
//                    for itemProvider in itemProviders {
//                        // 해당 객체가 있는지 식별
//                        if itemProvider.hasItemConformingToTypeIdentifier(kUTTypeImage as String) {
//                            itemProvider.loadItem(forTypeIdentifier: kUTTypeImage as String, options: nil, completionHandler: { result, error in
//                                var image: UIImage?
//                                if result is UIImage {
//                                    image = result as? UIImage
//                                }
//
//                                if result is URL {
//                                    let data = try? Data(contentsOf: result as! URL)
//                                    image = UIImage(data: data!)!
//                                }
//
//                                if result is Data {
//                                    image = UIImage(data: result as! Data)!
//                                }
//
//                                DispatchQueue.main.async {
//                                    if let image = image {
//                                        self.imageView.image = image
//                                    }
//                                }
//                            })
//                        }
//
//                        if itemProvider.hasItemConformingToTypeIdentifier(kUTTypeURL as String) {
//                            itemProvider.loadItem(forTypeIdentifier: kUTTypeURL as String, options: nil, completionHandler: { result, error in
//                                let data = NSData.init(contentsOf:result as! URL)
//                                DispatchQueue.main.async {
//                                    if let urlStr = result {
//                                        self.textView.text = "\(urlStr)"
//                                    }
//                                }
//                            })
//                        }
//                    }
//                }
//            }
//        }
//
//
//    @IBAction func btnSend(_ sender: UIButton) {
//        // 처리후 종료
//        if let userDefaults = UserDefaults(suiteName: "group.com.recipeade.com") {
//            if let image = imageView.image {
//                userDefaults.set(image.pngData(), forKey: "image")
//            }
//
//            if let text = textView.text {
//                userDefaults.set(text, forKey: "text")
//            }
//        }
//
//        self.hideExtensionWithCompletionHandler(completion: { _ in
//            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
//        })
//    }
//
//    @IBAction func btnDismiss(_ sender: UIButton) {
//        self.hideExtensionWithCompletionHandler(completion: { _ in
//            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
//        })
//    }
//
//    func hideExtensionWithCompletionHandler(completion: @escaping (Bool) -> Void) {
//        UIView.animate(withDuration: 0.3, animations: {
//            self.navigationController?.view.transform = CGAffineTransform(translationX: 0, y:self.navigationController!.view.frame.size.height)
//        }, completion: completion)
//    }
//}
