//
//  TestViewController.swift
//  Dragon-Calendar
//
//  Created by patrick zierahn on 26/10/16.
//  Copyright © 2016 patrick zierahn. All rights reserved.
//

import UIKit

class QrViewController: UIViewController
{
    static var isVisable = false
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
                
        QrViewController.isVisable = true
        
        openQrScanner()
    }

    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    static var scanner = QrCodeScanner()
    let button = UIButton(type: .system)
    
    func buttonClicked(_ sender: AnyObject?)
    {
        NSLog("back button clicked")
        removeQrScanner()
    }
    
    func removeQrScanner()
    {
        QrViewController.scanner.stopScan()
        QrViewController.scanner.removeAllLayers()
        QrViewController.isVisable = false
        
        self.dismiss(animated: ViewController.animated, completion: nil)
    }
    
    func addButton(parent: UIView)
    {
        let height = CGFloat(75)
        let yint = parent.frame.height - height
        
        buttonView.frame = CGRect(x: 0, y: yint, width: parent.frame.width, height: height)
        buttonView.backgroundColor = UIColor(red: 35/255, green: 35/255, blue: 35/255, alpha: 0.5)
        
        parent.addSubview(buttonView)
        
        button.frame = CGRect(x: 0, y: 0, width: buttonView.frame.width, height: buttonView.frame.height)
        button.setTitle("Back", for: UIControlState.normal)
        
        button.addTarget(nil, action: #selector(buttonClicked(_:)), for: .touchUpInside)
        
        buttonView.addSubview(button)
    }
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask
    {
        NSLog("supportedInterfaceOrientations")
        
        return UIInterfaceOrientationMask.portrait
    }
    
    override var shouldAutorotate: Bool
    {
        return false
    }
    
    let testView = UIView()
    let buttonView = UIView()
    
    override func viewDidLayoutSubviews()
    {
        NSLog("viewDidLayoutSubviews")
        testView.frame = self.view.bounds
        
        let height = CGFloat(75)
        let yint = testView.frame.height - height
        
        let size = CGRect(x: 0, y: yint, width: testView.frame.width, height: height)
        buttonView.frame = size
        button.frame = CGRect(x: 0, y: 0, width: testView.frame.width, height: height)        
        
        QrViewController.scanner.scanFrame = testView.bounds
        QrViewController.scanner.previewLayer.frame = testView.bounds
    }
    
    func openQrScanner()
    {
        testView.frame = self.view.bounds
        
        testView.layoutMargins = UIEdgeInsets(
            top: 0,
            left: 0,
            bottom: 0,
            right: 0)
        
        self.view.addSubview(testView)
        
        QrViewController.scanner.prepareScan(testView) { (stringValue) -> () in
            let call = "NativeInterface.qrCallback('" + stringValue + "')"
            ViewController.myWebView.evaluateJavaScript(call, completionHandler: nil)
            self.removeQrScanner()
        }
        
        QrViewController.scanner.startScan()

        addButton(parent: testView)
    }
}
