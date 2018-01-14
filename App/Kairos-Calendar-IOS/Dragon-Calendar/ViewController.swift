//
//  ViewController.swift
//  Dragon-Calendar
//
//  Created by Patrick Zierahn on 23/06/16.
//  Copyright © 2016 Patrick Zierahn. All rights reserved.
//

import UIKit
import WebKit
import AVFoundation

// import AVFoundation
// http://www.appcoda.com/qr-code-reader-swift/

class ViewController: UIViewController, UIWebViewDelegate, AVCaptureMetadataOutputObjectsDelegate
{
    static var myWebView:WKWebView!
    static let animated = false
    static var intentString = ""
    
    override func viewDidLoad()
    {
        super.viewDidLoad();
        // Do any additional setup after loading the view, typically from a nib.
        
        NSLog("viewDidLoad");
        
        let webInterface = WebAppInterface(mainView: self)
        let config = WebAppInterface.getConfig(interface: webInterface)
        
        ViewController.myWebView = WKWebView(frame: self.view.frame, configuration: config)
        
        DataManager.configure()
        
        createWebView()
    }
    
    override func viewDidLayoutSubviews()
    {
        NSLog("viewDidLayoutSubviews")

        let statusBarHeight = UIApplication.shared.statusBarFrame.size.height

        let screenSize: CGRect = UIScreen.main.bounds
        
        let screenWidth = screenSize.width
        let screenHeight = screenSize.height

        let newFrame = CGRect(
            x: 0,
            y: statusBarHeight,
            width: screenWidth,
            height: screenHeight - statusBarHeight)
        
        ViewController.myWebView.frame = newFrame
    }
    
    static var rotation = true
        
    override var preferredStatusBarStyle: UIStatusBarStyle
    {
        return UIStatusBarStyle.lightContent
    }

    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
        NSLog("didReceiveMemoryWarning")
    }
        
    static func updateWebView()
    {
        // get the home path directory
        // let homeDir = NSHomeDirectory()
        
        // load javascript file in String
        // let jsSource: String! = String.stringWithContentsOfFile(homeDir+"/mylib.js")

        ViewController.intentString = ""
        
        let path = Bundle.main.path(forResource: "app", ofType: "js")
        
        let data = try? Data(contentsOf: URL(fileURLWithPath: path!))
        let jApp:String! = data?.base64EncodedString(options: NSData.Base64EncodingOptions.endLineWithCarriageReturn)
                
        let html:String = "" +
            "<html>" +
            "<head>" +
                "<script>" +
                    "(function()" +
                    "{" +
                        "var parent = document.head;" +
                        "var script = document.createElement('script');" +
                        "script.type = 'text/javascript';" +
                        "script.innerHTML = decodeURIComponent(escape(window.atob('" + jApp + "')));" +
                        "parent.appendChild(script)" +
                    "})()" +
                "</script>" +
            "</head>" +
            "<body>" +
                "<script>Main.main();</script>" +
            "</body>" +
        "</html>"
        
        ViewController.myWebView.loadHTMLString(html, baseURL: nil)
    }
    
    func createWebView()
    {
        let bgColor = UIColor(red: 35/255, green: 35/255, blue: 35/255, alpha: 1.0)
        
        self.view.backgroundColor = bgColor

        ViewController.myWebView.scrollView.isScrollEnabled = false
        ViewController.myWebView.scrollView.bounces         = false
        ViewController.myWebView.scrollView.bouncesZoom     = false
        ViewController.myWebView.scrollView.backgroundColor = bgColor
        ViewController.myWebView.backgroundColor            = bgColor
        
        ViewController.updateWebView()
        
        self.view.addSubview(ViewController.myWebView)
    }
    
    func share(event: String)
    {
        NSLog("share: " + event)
        let vc = UIActivityViewController(activityItems: [event], applicationActivities: [])
        present(vc, animated: ViewController.animated)
    }
    
    func openMaps(place: String)
    {
        NSLog("openMaps: " + place)
        UIApplication.shared.openURL(NSURL(string: "http://maps.apple.com/?address=" + place)! as URL)
    }
    
    func showQrView()
    {
        NSLog("showQrView()")
        ViewController.rotation = false
        
        let controller = storyboard?.instantiateViewController(withIdentifier: "QrViewControllerStoryboard") as! QrViewController
        
        present(controller, animated: ViewController.animated, completion: nil)
        NSLog("done")
    }
}

