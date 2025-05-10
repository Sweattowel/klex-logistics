'use client'

import Foot from "@/app/Global/Foot";
import Nav from "@/app/Global/Nav"
import axios from "axios";
import { useState } from "react";
interface TestResult {
    TestMessage: string;
    TestTime: Date;
};
export default function Profile() {
    const [ testResults, setTestResults ] = useState<TestResult[]>([]);

    async function Handletests(){
        try {
            setTestResults([]);

            const addResult = (result: string) => {
                setTestResults(prev => [...prev, {TestMessage: result, TestTime: new Date()}]);
            };
            addResult("Testing User Access");
            addResult(await TestService(200, "http://localhost:5201/AuthenticationUserControl/HandleUserLogin", 1, body,"✅ Successfully logged User in", "❌ Failed to log User in"));
            addResult(await TestService(200, "http://localhost:5201/AuthenticationUserControl/HandleVerifyUser", 1,body,"✅ Successfully verified User log in", "❌ Failed to validate User log"));
            addResult(await TestService(200, "http://localhost:5201/AuthenticationUserControl/HandleUserLogout", 1,body,"✅ Successfully logged User out", "❌ Failed to log User out"));
            addResult(await TestService(200, "http://localhost:5201/AuthenticationUserControl/HandleVerifyUser", 1,body,"✅ Successfully verified User log out", "❌ Failed to validate User delog"));
            addResult("Testing Administrator Access");
            addResult(await TestService(200, "http://localhost:5201/AuthenticationAdministratorControl/HandleAdminLogin", 1,body,"✅ Successfully logged Admin in", "❌ Failed to log Admin in"));
            addResult(await TestService(200, "http://localhost:5201/AuthenticationAdministratorControl/HandleVerifyAdmin", 1,body,"✅ Successfully verified Admin log in", "❌ Failed to validate Admin log"));
            addResult(await TestService(200, "http://localhost:5201/AuthenticationAdministratorControl/HandleAdminLogout", 1,body,"✅ Successfully logged Admin out", "❌ Failed to log Admin out"));
            addResult(await TestService(200, "http://localhost:5201/AuthenticationAdministratorControl/HandleVerifyAdmin", 1,body,"✅ Successfully verified Admin log out", "❌ Failed to validate Admin delog"));
        } catch (error) {
            console.error(error);
        };
    };
    async function TestService(expectedResult: number, endpoint: string, type: number, body: any, Succ: string, Fail: string){
        try {
            let response;
    
            switch (type) {
                case 0:
                    response = await axios.get(endpoint, {withCredentials: true});
                    break;
                case 1:
                    response = await axios.post(endpoint, body, {withCredentials: true});
                    break;
                default:
                    console.log("Failed to make request for endpoint: ", endpoint);
                    return Fail;
            }
            if (response.status === expectedResult) {
                console.log(Succ,response);
                return Succ;
            } else {
                console.error(Fail + ` (Expected ${expectedResult}, got ${response.status})`);
                return Fail;
            };

        } catch (error: any) {
            const status = error.response?.status;
            if (status === expectedResult) {
                console.log(Succ + ` (${status} as expected)`);
                return Succ;
            } else {
                console.error(Fail + ` (Expected ${expectedResult}, got ${status ?? "No response"})`, error);
                return Fail;
            }
        }
    };

    return (
        <main>
            <Nav />
            <section className="h-[80vh] flex flex-col justify-evenly items-center">
                <h1 className="w-full bg-gradient-to-br from-green-400 m-2 p-2">
                    Profile Page
                </h1>
                <button onClick={() => Handletests()}
                    className="border rounded bg-gradient-to-br hover:from-green-200 hover:cursor-pointer p-5"
                >
                    Run Tests
                </button>
                <ul className="h-[50vh] w-[80vw] border rounded divide-y overflow-auto">
                    {testResults && testResults.map((result : TestResult, index: number) => (
                        <li key={index}
                            className="w-[90%] m-auto p-1"
                        >
                            {result.TestMessage} | {result.TestTime.toTimeString().slice(0,9)}
                        </li>
                    ))}
                </ul>
            </section>
            <Foot />
        </main>
    );
};
        
const body = {
    AccountID: 0,
    AccountName: "Test",
    AccountEmail: "TestEmail",
    AccountStartDate: new Date().toISOString(),
    AccountTransactions: 101,
    AccountBeingCharged: true,
    PlanCount: 0,
    Plans: [],
    PowerYears: [],
};