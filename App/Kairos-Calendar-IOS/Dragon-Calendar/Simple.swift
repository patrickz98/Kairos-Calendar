//
//  Simple.swift
//  Dragon-Calendar
//
//  Created by patrick zierahn on 23/10/16.
//  Copyright © 2016 patrick zierahn. All rights reserved.
//

import Foundation

class Simple
{
    static func toJson(jsonAny: Any) -> String
    {
        var json = "{}"
        
        do
        {
            let jsonData = try JSONSerialization.data(withJSONObject: jsonAny, options: JSONSerialization.WritingOptions.init(rawValue: 0))

            let decodedData = NSData(base64Encoded: jsonData.base64EncodedString(), options:NSData.Base64DecodingOptions.init(rawValue: 0))
            let decodedString = NSString(data: decodedData as! Data, encoding: String.Encoding.utf8.rawValue)
            
            json = decodedString as! String
        }
        catch
        {
            print(error.localizedDescription)
        }
        
        return json
    }
    
    static func getId(json: String) -> String
    {
        let data = json.data(using: .utf8)!
        if let parsedData = try? JSONSerialization.jsonObject(with: data) as! [String:Any]
        {
            let id = parsedData[ "id" ] as! String
            return id
        }
        
        return ""
    }
}
