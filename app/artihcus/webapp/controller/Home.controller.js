sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, MessageToast, MessageBox, UIComponent, JSONModel) {
        "use strict";

        return Controller.extend("com.app.artihcus.controller.Home", {
            onInit() {
                const oUserModel = new JSONModel({
                    userID: "",
                    fName: "",
                    lName: "",
                    phoneNo: "",
                    mailID: "",
                    password: "",
                    expireDate: "",
                    profileImage: ""
                });
                // Set the combined model to the view
                this.getView().setModel(oUserModel, "UserModel")
            },
            onLogin: async function () {
                // MessageToast.show("Login button clicked");
                // Navigate to login page or handle login logic
                if (!this.oLoginDialog) {
                    this.oLoginDialog = await this.loadFragment("login");
                }
                this.oLoginDialog.open();

            },
            oncancelbtn: function () {
                if (this.oLoginDialog.isOpen()) {
                    this.oLoginDialog.close();
                }
            },
            onSignup: async function () {
                if (!this.oSignUpDialog) {
                    this.oSignUpDialog = await this.loadFragment("SignUp");
                }

                this.oSignUpDialog.open();

            },
            onCancelPressInSignUp: function () {
                if (this.oSignUpDialog.isOpen()) {
                    this.getView().getModel("UserModel").setProperty("/", {})
                    this.oSignUpDialog.close();

                }
            },
            onLoginBtnPressInLoginDialog: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("MainPage");

            },
            //  change password fragment loading
            onChangePasswordBtn: async function () {
                this.oLoginDialog.close();
                if (!this.oChangePasswordDialog) {
                    this.oChangePasswordDialog = await this.loadFragment("ChangePassword");
                }
                this.oChangePasswordDialog.open();
            },
            onPressCancelInChangePassword: function () {
                this.byId("idChangePasswordDialog").close();
                this.byId("idconnectsapdialogbox_CS1").open();

            },
            onAfterNumberEnter: function () {
                const value = this.getView().byId("_IDGenInpuseft4").getValue()
                if (!value || !value.length === 10 ) {
                  this.getView().byId("idOTPBtn").setEnabled(false)
                } else {
                  this.getView().byId("idOTPBtn").setEnabled(true)
                }
              },
            onGetOTPPress: function () {
                const oUserView = this.getView(),
                    sPhnNumber = oUserView.byId("_IDGenInpuseft4").getValue()
                var flag = true;
                if (!sPhnNumber || sPhnNumber.length !== 10 || !/^[6-9]\d{9}$/.test(sPhnNumber)) {
                    oUserView.byId("_IDGenInpuseft4").setValueState("Error");
                    oUserView.byId("_IDGenInpuseft4").setValueStateText("please enter 10 digit correct number");
                    flag = false;
                } else {
                    oUserView.byId("_IDGenInpuseft4").setValueState("None");
                }
                if (!flag) {
                    return;
                }

                // Prepare the Twilio API details
                var formattedPhoneNumber = "+91" + sPhnNumber; // Assuming country code for India
                const accountSid = this.oTwilioConfig.AccountSID;  // Constant.oAccountSID;
                const authToken = this.oTwilioConfig.AuthToken;   // Constant.oAuthToken;
                const serviceSid = this.oTwilioConfig.ServiceID;   // Constant.oServiceID;
                const url = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;

                // Prepare the data for the request
                const payload = {
                    To: formattedPhoneNumber,
                    Channel: 'sms'
                };

                var that = this;

                // Make the AJAX request to Twilio to send the OTP
                $.ajax({
                    url: url,
                    type: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(payload),
                    success: function (data) {
                        sap.m.MessageToast.show('OTP sent successfully!')

                        // Store the phone number for later use in OTP verification
                        that._storedPhoneNumber = formattedPhoneNumber;

                        // Open the OTP dialog
                        that.getView().byId("idOTPHBox").setVisible(true)

                    }.bind(that),
                    error: function (xhr, status, error) {
                        oMobileinput.setValueState(sap.ui.core.ValueState.Error)
                        oMobileinput.setValueStateText("check your Mobile Number")
                        console.error('Error sending OTP:', error);
                        sap.m.MessageToast.show('Failed to send OTP')
                    }
                });

            },
            onSignUpPress: async function () {

                const oPayload = this.getView().getModel("UserModel").getProperty("/"),
                    sPath = "/Users",
                    oModel = this.getOwnerComponent().getModel("ModelV2"),
                    oUserView = this.getView(),
                    that = this,
                    raisedErrors = [];
                // Validations
                const aUserInputs = [
                    { Id: "_IDGenInputd2", value: oPayload.fName, regex: /^[A-Za-z]{3,}$/, message: "Enter first name atleast 3 characters long (alphabets only)" },
                    { Id: "_IDGenInputd3", value: oPayload.lName, regex: /^[A-Za-z]{3,}$/, message: "Enter last name atleast 3 characters long (alphabets only)" },
                    { Id: "_IDGenInpust4", value: oPayload.mailID, regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Enter correct E-mail" },
                    { Id: "_IDGenInpuseft4", value: oPayload.phoneNo, regex: /^[6-9]\d{9}$/, message: "Enter correct phone number" },
                    {
                        Id: "_IDGenInputs5", value: oPayload.password, regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                        message: "*At least 8 characters long.\n*Contains at least one Uppercase.\n*Contains at least one special character (e.g., @, #, $, etc.).\n*Contains at least one numeric digit."
                    }
                ];

                aUserInputs.forEach(async input => {
                    let aValidations = this.validateField(oUserView, input.Id, input.value, input.regex, input.message)
                    if (aValidations.length > 0) {
                        raisedErrors.push(aValidations[0]) // pushning error into empty array
                    }
                })

                if (raisedErrors.length > 0) {
                    for (let error of raisedErrors) {
                        MessageBox.information(error) // showing error msg 
                        return;
                    }
                }

                try {
                    const oResponse = await this.readData(oModel, sPath);
                    // Accessing the data in the response
                    const aResults = oResponse.results;
                    if (aResults.length === 0) {
                        oPayload.userID = "ARTDKN0001"
                    } else {
                        const aSortedarray = aResults.sort((a, b) => b.userID.localeCompare(a.userID)), // descendign order to get the highest number user id
                            currentMaxID = aSortedarray[0].userID
                        // generation of user ID
                        function generateUniqueString(currentString) {
                            // Extract the prefix (non-numeric part) and the number (numeric part)
                            const prefix = currentString.match(/[^\d]+/g)[0]; // Extract non-numeric characters
                            const number = parseInt(currentString.match(/\d+/g)[0], 10); // Extract numeric characters and convert to integer

                            // Increment the numeric part by 1
                            const newNumber = number + 1;

                            // Format the new number with leading zeros to match the original length
                            const formattedNumber = String(newNumber).padStart(currentString.length - prefix.length, '0');

                            // Combine the prefix and the formatted number to get the new unique string
                            return prefix + formattedNumber;
                        }
                        // call
                        const newuserID = generateUniqueString(currentMaxID);
                        oPayload.userID = newuserID

                    }

                    // // get the actual password
                    // const sActualPass = oPayload.Password
                    // // Use SHA256 for hashing (CryptoJS )
                    // const sEncrytpedPass = CryptoJS.SHA256(sActualPass).toString(); // encryption with CryptoJS
                    // oPayload.Password = sEncrytpedPass

                    // Create a record with payload
                    await this.createData(oModel, oPayload, sPath);
                    sap.m.MessageToast.show("Signup Successfull");
                    // set the empty data after successful creation
                    this.getView().getModel("UserModel").setProperty("/", {});
                    // Send the generated userID to User

                    // // Send POST request to Twilio API using jQuery.ajax
                    // const accountSid = this.oSMSConfig.AccountSID,
                    //     authToken = this.oSMSConfig.AuthToken,
                    //     url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                    //     fromNumber = '+15856485867';
                    // $.ajax({
                    //     url: url,
                    //     type: 'POST',
                    //     async: true,
                    //     headers: {
                    //         'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                    //     },
                    //     data: {
                    //         To: `+91${oPayload.Phonenumber}`,
                    //         From: fromNumber,
                    //         Body: `Hi ${oPayload.Firstname} your login ID for RF app is ${oPayload.userID} don't share with anyone. \nThank You,\nArtihcus Global.`
                    //     },
                    //     success: function (data) {
                    //         sap.m.MessageBox.show('Login ID will be sent via SMS to your mobile number');
                    //     },
                    //     error: function (error) {
                    //         sap.m.MessageBox.information(`Failed to send SMS.\nyour user ID is ${oPayload.userID} please note this for future use`);
                    //         console.error('Failed to send user ID' + error.message);
                    //     }
                    // });
                    // // SMS END
                } catch (error) {
                    sap.m.MessageToast.show("Something went wrong try again later....");
                    console.error("Failed to create record." + error);
                }
            },
        });
    });