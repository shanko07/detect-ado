import {DetectScript} from "../ts/DetectScript";
import {BashDetectScript} from "../ts/BashDetectScript";
import {Done} from "mocha";
import * as fileSystem from 'fs'
import {IBlackduckConfiguration} from "../ts/model/IBlackduckConfiguration";
import {IDetectConfiguration} from "../ts/model/IDetectConfiguration";
import {PowershellDetectScript} from "../ts/PowershellDetectScript";
import {DetectSetup} from "../ts/DetectSetup";

const fileSystemExtra = require("fs-extra")
const assert = require('assert')

describe('BashDetect tests', function () {
    const folder = "test_folder_2"

    let powershellScript: DetectScript

    before( function() {
        powershellScript = new PowershellDetectScript()
    })

    after(function () {
        fileSystemExtra.removeSync(folder)
    })

    it.skip('run detect script', async() => {
        const blackduckConfiguration: IBlackduckConfiguration = {
            blackduckApiToken: undefined,
            blackduckPassword: undefined,
            blackduckUrl: "",
            blackduckUsername: undefined,
            proxyInfo: undefined
        }

        const detectConfiguration: IDetectConfiguration = {
            detectAdditionalArguments: "--blackduck.offline.mode=true",
            detectFolder: folder,
            detectVersion: "latest"
        }

        const detectSetup = new DetectSetup()
        const env = detectSetup.createEnvironmentWithVariables(blackduckConfiguration, detectConfiguration)
        const result: number = await powershellScript.invokeDetect(detectConfiguration.detectAdditionalArguments, detectConfiguration.detectFolder, env)
        assert.ok(fileSystem.existsSync(`${folder}/${powershellScript.getScriptName()}`), "Downloaded file did not exist")
        assert.strictEqual(0, result, "Detect scan should have ended in success")
    });
});