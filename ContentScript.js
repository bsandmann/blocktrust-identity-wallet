// this script comes from the extensions and gets directly executed in each website
// It creates a <script>-tag in each pages and attaches the script inside 'initialInject'
// into every page. The website has than the ability to call functions of that script

const initialInject = `
function sendSignatureRequest(signatureRequest, signatureRequestReturnFunction) {
    signatureRequestCallback = signatureRequestReturnFunction;
    console.log(JSON.stringify(signatureRequest));
    window.postMessage({
        type: "SIGNATURE_REQUEST",
        text: JSON.stringify(signatureRequest)
    }, "*");
}
function verificationRequest(verificationRequest, verificationRequestReturnFunction) {
    verificationRequestCallback = verificationRequestReturnFunction;
    console.log(JSON.stringify(verificationRequest));
    window.postMessage({
        type: "VERIFICATION_REQUEST",
        text: JSON.stringify(verificationRequest)
    }, "*");
}
var signatureRequestCallback;
var verificationRequestCallback;
(function () {
    window.addEventListener("message", function (event) {
        if (event.data.type && event.data.type == "FROM_INJECTED_SIGNATURE_REQUEST") {
            console.log("Content script received: " + event.data.text);
            signatureRequestCallback(event.data.text);
        }
        else if (event.data.type && event.data.type == "FROM_INJECTED_VERIFICATION_REQUEST") {
            console.log("Content script received: " + event.data.text);
            verificationRequestCallback(event.data.text);
        }
    }, false);
})();
`
window.addEventListener(
    "message",
    (event) => {
        console.log('Injected ContentScript is recieving message')
        if (event.data.type && event.data.type == "SIGNATURE_REQUEST") {
            console.log("Injected ContentScript received: " + event.data.text);
            //sending a message to the popupextension
            chrome.runtime.sendMessage({signatureRequest: event.data.text}, function (response) {
                // opterional callback
                // console.log(response.farewell);
            });

            // send a msg back to the 
            window.postMessage({
                type: "FROM_INJECTED_SIGNATURE_REQUEST",
                text: "open your wallet and please sign the credential :)",
            });
        } else if (event.data.type && event.data.type == "VERIFICATION_REQUEST") {
            console.log("Injected ContentScript received: " + event.data.text);
            //sending a message to the popupextension
            chrome.runtime.sendMessage({verificationRequest: event.data.text}, function (response) {
                // opterional callback
                // console.log(response.farewell);
            });

            // send a msg back to the 
            window.postMessage({
                type: "FROM_INJECTED_VERIFICATION_REQUEST",
                text: "open your wallet and please send us the requested credential for verification",
            });
        }
    },
    false
);

// This code listens to a message from the popup-extension 
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("msg: from the extension: " + request);
        console.log(request);
        // send a msg back to the 
        const parsed = JSON.parse(request);
        if (parsed.OperationType === 'SignatureRequest') {
            window.postMessage({
                type: "FROM_INJECTED_SIGNATURE_REQUEST",
                text: request,
            });
        }
        else if (parsed.OperationType === 'VerificationRequest') {
            window.postMessage({
                type: "FROM_INJECTED_VERIFICATION_REQUEST",
                text: request,
            });
        }
    }
);

// simple injection code by yoroi - wallet
injectIntoPage(initialInject);

function injectIntoPage(code) {
    try {
        const container = document.head || document.documentElement;
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute("async", "false");
        scriptTag.textContent = code;
        container.insertBefore(scriptTag, container.children[0]);
        container.removeChild(scriptTag);
        console.log(`blocktrust identity wallet injected into ${location.hostname}`);
        markInjectionInDocument(container);
        return true;
    } catch (e) {
        console.error(`blocktrust identity wallet injection failed!`, e);
        return false;
    }
}

function markInjectionInDocument(container) {
    const inp = document.createElement('input');
    inp.setAttribute('type', 'hidden');
    container.appendChild(inp);
}
