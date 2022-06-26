# blocktrust-identity-wallet
A browser wallet for Atala PRISM

## Features
This wallet is a *proof-of-concept* for an Atala PRISM light wallet running as a browser extension. The wallet features basic functionality to:
* Create a new wallet (including a first DID) and store it locally in the local-storage.
  * While at rest, the wallet is encrypted (AES256) and gets decrypted when entering the wallet password.
  * ~~Restoring the DID with a mnemonic phrase~~
* Display the DID and all derived keys: *master0, issuing0, revocation0*
  * Auto-resolve of DID 
  * ~~Revoking the keys (or the Did in general)~~
* Issue simple credentials to any other DID
  * Add a flat list of claims
  * ~~Advanced schema support~~
* Revoke credentials previously issued
* Export and import credentials based on a Json-format
  * Including batchId and operationHash for revocation
* Verify credentials
* Test for a “dApp-Connector” to connect the wallet to a website
  * Allows basic two-way-communication between a website and the extension
  * Sample implementation of “Signature request” and “Verification requests”

### dApp-Connector
The main reason to build a browser extension wallet are the possibilities to interact with verifiable credentials on websites. The test demonstrates a simple two-way communication between the wallet and a website. While the user flow is still rough, it shows how someone could:
* Build a website which asks the user to sign a credential which was created by the website. A possible use-case would be after a successful transaction on a website (e.g., a NFT-sale). The website could ask the user to write a short review and then send the credential to the users' wallet for the signature before getting the signed operation back to send it to the server. 
* Build a website which asks the user for a specific credential. The website could request a credential issued by Alice with contains claim A and claim B. This request gets send to the wallet and evaluated. If the user has the requested credential in his wallet, he could simply “accept” the request and automatically send the credential including the proof to the website. The website could then simply verify it in its backend and then provide some service based on this credential: e.g., it could create an JWT-Token or Cookie. This would constitute a simple credential-based-login.

## Implementation
Technically, the wallet is based on a .net SDK which talks to the Atala PRISM Node without the need of the PRISM SDK or any Kotlin/JVM Code in between. The wallet and the supporting libraries are all written in C# which are compiled to run as a Blazor application (based on WebAssembly). The same wallet code could also easily be deployed as an Android or iOS Application (using .net MAUI).


## How to run
Being just a POC at this state, you have to sideload the extension yourself and can’t just download it from the Chrome/Edge/Firefox Webstore.
But it's straightforward:
1.	Download the complete files of this GitHub repository
2.	Open Chrome → Extensions
3.	Enable the developer mode
4.	Click on “Load unpacked”
5.	Point it to the right directory and click Ok. If you get an error-message it usually means you are in the wrong directory 😉
6.	You might get an error regarding “manifest v2”, but that’s expected for now.
7.	The extension is now loaded. Pin the icon to have directly accessible.
8.	Have fun trying it out

![Install wallet in chrome](installChromeWallet1.jpg)
![Enable wallet in chrome](installChromeWallet2.jpg)

## Known issues
Besides the missing features there are currently a few minor or major problems:
-	Loading times are bad, partly because of the AOT compilation, partly because of missed optimizations
-	Not optimized for Firefox
-	Popup/Full Screen issues
-	Sometimes not receiving requests / or displaying requests from the websites
-	Unexpected navigation jumps
-	Unclear support for manifest v3


## Contact
For further information feel free to contact me at: sandmann@blocktrust.dev
