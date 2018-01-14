//
//  WebAppInterface.swift
//  Dragon-Calendar
//
//  Created by patrick zierahn on 21/10/16.
//  Copyright © 2016 patrick zierahn. All rights reserved.
//

import WebKit
import Foundation

class WebAppInterface: NSObject, WKScriptMessageHandler
{
    var mainView: ViewController
    
    init(mainView: ViewController)
    {
        self.mainView = mainView
    }
    
    static func getConfig(interface: WebAppInterface) -> WKWebViewConfiguration
    {
        let contentController = WKUserContentController()
        contentController.add(interface, name: "showToast")
        contentController.add(interface, name: "openScanner")
        contentController.add(interface, name: "putConfig")
        contentController.add(interface, name: "update")
        contentController.add(interface, name: "events")
        contentController.add(interface, name: "delete")
        contentController.add(interface, name: "config")
        contentController.add(interface, name: "reload")
        contentController.add(interface, name: "exeIntent")
        contentController.add(interface, name: "share")
        contentController.add(interface, name: "openMaps")

        let config = WKWebViewConfiguration()
        config.userContentController = contentController

        return config
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
    {
        if (message.name == "showToast")
        {
            NSLog("Javascript: " + (message.body as! String))
        }
        
        if (message.name == "openScanner")
        {
            NSLog("openScanner");
//            ViewController.openQrScanner(mainView: mainView);
            mainView.showQrView()
        }
        
        if (message.name == "putConfig")
        {
            DataManager.putConfig(config: (message.body as! String))
        }
        
        if (message.name == "update")
        {
            let entry = (message.body as! String)
            let id = Simple.getId(json: entry)
            
            DataManager.update(uuid: id, entry: entry)
        }
        
        if (message.name == "events")
        {
            DataManager.events()
        }
        
        if (message.name == "delete")
        {
            if let id = message.body as? String
            {
                DataManager.delete(uuid: id)
            }
        }
        
        if (message.name == "config")
        {
            let callback = (message.body as! String)
            DataManager.config(callback: callback)
        }
        
        if (message.name == "reload")
        {
            NSLog("reload")
            ViewController.updateWebView()
        }
        
        if (message.name == "exeIntent" && ViewController.intentString != "")
        {
            NSLog("exeIntent: " + ViewController.intentString)
            
            let call = "NativeInterface.intent('" + ViewController.intentString + "')"
            ViewController.myWebView.evaluateJavaScript(call, completionHandler: nil)
        }
        
        if (message.name == "share")
        {
            let event = (message.body as! String)
            mainView.share(event: event)
        }
        
        if (message.name == "openMaps")
        {
            let place = (message.body as! String)
            mainView.openMaps(place: place)
        }
    }
}
