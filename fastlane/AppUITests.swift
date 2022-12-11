//
//  AppUITests.swift
//  AppUITests
//
//  Created by David Anthony Gey on 05.12.22.
//

import XCTest

final class AppUITests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() throws {
        // UI tests must launch the application that they test.
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        snapshot("0Launch")

        printElementsOnScreen(app)

        let scanButton = app.webViews.buttons["Scan bluetooth"]
        scanButton.tap()
        snapshot("1DevicepageUpdate")

        printElementsOnScreen(app)

        let closeUpdateButton = app.webViews.buttons["checkmark circle Yes"]
        closeUpdateButton.tap()
        snapshot("2UpdatePage")

        printElementsOnScreen(app)

    }

    func testLaunchPerformance() throws {
        if #available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 7.0, *) {
            // This measures how long it takes to launch your application.
            measure(metrics: [XCTApplicationLaunchMetric()]) {
                XCUIApplication().launch()
            }
        }
    }

    func printElementsOnScreen(_ app: XCUIApplication) {
        print("----- ELEMENTS ON SCREEN -----")
        print("Buttons: \(app.buttons.allElementsBoundByIndex.map { $0.label.isEmpty ? "Value: \($0.value ?? "")" : "Label: \($0.label)" })")
        print("Static Texts: \(app.staticTexts.allElementsBoundByIndex.map { $0.label.isEmpty ? "Value: \($0.value ?? "")" : "Label: \($0.label)" })")
        print("Text Fields: \(app.textFields.allElementsBoundByIndex.map { $0.label.isEmpty ? "Value: \($0.value ?? "")" : "Label: \($0.label)" })")
        print("Text Views: \(app.textViews.allElementsBoundByIndex.map { $0.label.isEmpty ? "Value: \($0.value ?? "")" : "Label: \($0.label)" })")
    }
}
