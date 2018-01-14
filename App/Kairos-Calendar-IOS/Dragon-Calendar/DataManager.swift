//
//  QrScanner.swift
//  Dragon-Calendar
//
//  Created by patrick zierahn on 11/09/16.
//  Copyright © 2016 patrick zierahn. All rights reserved.
//

import Foundation
import WebKit

class DataManager
{
    static let eventsKey = "Events"
    static let configKey = "Config"
    static let preferences = UserDefaults.standard
    
//    func jsCallback(function: String, message: String)
//    {
//        let call = function + "('" + message + "')";
//        webView.evaluateJavaScript(call, completionHandler: nil);
//    }

    static func configure()
    {
        if preferences.object(forKey: configKey) == nil
        {
            NSLog("New Key: " + configKey)
            preferences.set("None", forKey: configKey)
        }
        
        if preferences.object(forKey: eventsKey) == nil
        {
            NSLog("New Key: " + eventsKey)
            
            let map: [String: String] = [:]
            preferences.set(map, forKey: eventsKey)
        }
    }
    
    static func update(uuid: String, entry: String)
    {
        NSLog("update(" + uuid + ")")
        
        var map: [String: String] = preferences.object(forKey: eventsKey) as! [String: String]
        map[ uuid ] = entry
                
        preferences.set(map, forKey: eventsKey)
    }
    
    static func delete(uuid: String)
    {
        NSLog("delete(" + uuid + ")")
        var map: [String: String] = preferences.object(forKey: eventsKey) as! [String: String]
        
        map.removeValue(forKey: uuid)
        
        preferences.set(map, forKey: eventsKey)
    }

    static func events()
    {
        NSLog("events()")
        
        let map: [String: String] = preferences.object(forKey: eventsKey) as! [String: String]
        
        var events: [String] = []
        
        for entry in map
        {
            events.append(entry.value)
        }
        
        let json = Simple.toJson(jsonAny: events)
        
        let call = "Main.finishedLoadingIOS(JSON.stringify(" + json + "))";
        ViewController.myWebView.evaluateJavaScript(call, completionHandler: nil);
    }
    
    static func putConfig(config: String)
    {
        NSLog("putConfig(): " + config)
        preferences.set(config, forKey: configKey)
    }
    
    static func config(callback: String)
    {
        let config = preferences.string(forKey: configKey)
        NSLog("config(): " + config!)
        
        let call = callback + "('" + config! + "')";
        ViewController.myWebView.evaluateJavaScript(call, completionHandler: nil);
    }
}
