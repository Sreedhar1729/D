sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, MessageToast, MessageBox, UIComponent, JSONModel) {
    function (Controller, MessageToast, MessageBox, UIComponent, JSONModel) {
        "use strict";

        return Controller.extend("com.app.artihcus.controller.Home", {
            async onInit() {
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
                // Check credentials are saved
                await this.checkAutoLogin()


            },
            checkAutoLogin: async function () {

                const savedData = localStorage.getItem('loginData');
                if (savedData) {
                    const { userID, token, expiration } = JSON.parse(savedData);

                    // Check if data is expired
                    if (Date.now() > expiration) {
                        console.log('Login data has expired');
                        localStorage.removeItem('loginData');
                        sap.m.MessageToast.show("Login expired")
                        return null;
                    }

                    try {
                        const oModel = this.getOwnerComponent().getModel("ModelV2")
                        const fUser = new sap.ui.model.Filter("userID", sap.ui.model.FilterOperator.EQ, userID),
                            fPassword = new sap.ui.model.Filter("password", sap.ui.model.FilterOperator.EQ, token),
                            aFilters = new sap.ui.model.Filter({
                                filters: [fUser, fPassword],
                                and: true
                            });
                        const oResponse = await this.readData(oModel, "/Users", aFilters)
                        if (oResponse.results.length === 1) {
                            // Show success message
                            sap.m.MessageToast.show("Welcome back");

                            // Navigate to the Initial Screen
                            const oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("MainPage");
                        }
                    } catch (error) {
                        sap.m.MessageToast.show("Oops something went wrong please refresh the page");
                        console.error(error);
                    }
                }

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
                this.oSignUpDialog.open();

            },
            onCancelPressInSignUp: function () {
                if (this.oSignUpDialog.isOpen()) {
                    this.getView().getModel("UserModel").setProperty("/", {})
                    this.oSignUpDialog.close();

                }
            },
            onLoginBtnPressInLoginDialog: async function () {
                debugger
                const oModel = this.getOwnerComponent().getModel("ModelV2"),
                    oUserView = this.getView(),
                    sPath = "/Users",
                    sUserEnteredUserID = this.getView().byId("_IDGenInput11").getValue(),
                    sUserEnteredPassword = this.getView().byId("_IDGenInput221").getValue();


                // validations
                var flag = true;
                if (!sUserEnteredUserID) {
                    oUserView.byId("_IDGenInput11").setValueState("Warning");
                    oUserView.byId("_IDGenInput11").setValueStateText("Please enter registered user ID");
                    flag = false;
                } else {
                    oUserView.byId("_IDGenInput11").setValueState("None");
                }
                if (!sUserEnteredPassword) {
                    oUserView.byId("_IDGenInput221").setValueState("Warning");
                    oUserView.byId("_IDGenInput221").setValueStateText("Enter your password");
                    flag = false;
                } else {
                    oUserView.byId("_IDGenInput221").setValueState("None");
                }
                if (!flag) {
                    sap.m.MessageToast.show("Please enter required credentials")
                    // Close busy dialog
                    this._oBusyDialog.close();
                    return;
                }

                const fUser = new sap.ui.model.Filter("userID", sap.ui.model.FilterOperator.EQ, sUserEnteredUserID),
                    // fPassword = new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, sUserEnteredPassword),
                    aFilters = new sap.ui.model.Filter({
                        filters: [fUser],
                        and: true // Change to false if you want OR logic
                    });

                // create busy dialog
                if (!this._oBusyDialog) {
                    this._oBusyDialog = new sap.m.BusyDialog({
                        text: "Authenticating"
                    });
                }
                try {
                    // Open busy dialog
                    this._oBusyDialog.open();

                    // Simulate buffer using setTimeout
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Fetch data from the model
                    const oResponse = await this.readData(oModel, sPath, aFilters);

                    if (oResponse.results.length > 0) {
                        const oResult = oResponse.results[0],
                            sStoredUserId = oResult.userID,
                            sStoredPassword = oResult.password;

                        // Encrypt user-entered password with SHA256
                        const sEncryptedPass = CryptoJS.SHA256(sUserEnteredPassword).toString();

                        if (sUserEnteredUserID === sStoredUserId && sStoredPassword === sEncryptedPass) {
                            // Auto Save 
                            const oCheckbox = this.getView().byId("_IDGenChe22ckBox");
                            if (oCheckbox.getSelected()) {
                                await this.onAutoSaveData(sUserEnteredUserID, sStoredPassword)
                            }
                            this._onLoginSuccess(sUserEnteredUserID);
                        } else {
                            this._onLoginFail("Authentication failed");
                        }
                    } else {
                        this._onLoginFail("User ID not found");
                    }
                } catch (error) {
                    this._oBusyDialog.close();
                    sap.m.MessageToast.show("Something went wrong. Please try again later.");
                    console.error("Error Found:", error);
                } finally {
                    // Close busy dialog
                    this._oBusyDialog.close();
                }
            },
            _onLoginSuccess(sUserEnteredUserID) {
                // Clear input fields
                this.getView().byId("_IDGenInput11").setValue("");
                this.getView().byId("_IDGenInput221").setValue("");

                // Show success message
                sap.m.MessageToast.show("Login Successfull");

                // Navigate to the Initial Screen
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("MainPage");
                // window.location.reload(true);

            },
            _onLoginFail(sMessage) {
                // Show failure message
                sap.m.MessageToast.show(sMessage);
            },
            onAutoSaveData: function (CurrentUser, Token) {
                // Save credentials with an expiration time 

                const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // Current time + expiration time in ms( hr * min * sec * millisec )

                const loginData = {
                    userID: CurrentUser,
                    token: Token,
                    expiration: expirationTime
                };

                // Save to local storage as a JSON string
                localStorage.setItem('loginData', JSON.stringify(loginData));

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
                if (!value || !value.length === 10) {
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
                    sap.m.MessageBox.information("Enter correct phone number")
                    return;
                }

                // Prepare the Twilio API details
                var formattedPhoneNumber = "+91" + sPhnNumber; // Assuming country code for India
                const accountSid = "ACd2aa0faa93339ceb8b1f3aad47fc1c80";  // Constant.oAccountSID;
                const authToken = "f1cf11fa75eefd1d2bc7640fc23639f3";   // Constant.oAuthToken;
                const serviceSid = "VA86b64328119f75c18392bdd98fd32546";   // Constant.oServiceID;
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
                        sap.m.MessageToast.show('OTP sent successfully!');

                        // Store the phone number for later use in OTP verification
                        that._storedPhoneNumber = formattedPhoneNumber;

                        // Open the OTP dialog
                        that.getView().byId("_IDGenregeHBosx5").setVisible(true);

                    }.bind(that),
                    error: function (xhr, status, error) {
                        oUserView.byId("_IDGenInpuseft4").setValueState(sap.ui.core.ValueState.Error)
                        oUserView.byId("_IDGenInpuseft4").setValueStateText("check your mobile number")
                        console.error('Error sending OTP:', error);
                        sap.m.MessageToast.show('Failed to send OTP')
                    }
                });
            },

            onValidateOTP: function () {
                const that = this;
                // Create a Busy Dialog instance
                if (!this._oValidatingBusyDialog) {
                    this._oValidatingBusyDialog = new sap.m.BusyDialog({
                        text: "Please wait while validatiing OTP"
                    });
                }
                // Open the Busy Dialog
                this._oValidatingBusyDialog.open();

                const oMobileinput = this.byId("_IDGenInpuseft4"),
                    oOtpInput = this.byId("_IDGenInrfgpuseft4"),
                    sEnteredOtp = oOtpInput.getValue();

                // Basic validation: Check if OTP is entered
                if (!sEnteredOtp) {
                    oOtpInput.setValueState(sap.ui.core.ValueState.Error);
                    oOtpInput.setValueStateText("Please enter OTP");
                    sap.m.MessageToast.show("Please enter OTP");
                    this._oValidatingBusyDialog.close();
                    return;
                }

                // Validate OTP: It should be exactly 6 digits
                var otpRegex = /^\d{6}$/;
                if (!otpRegex.test(sEnteredOtp)) {
                    oOtpInput.setValueState(sap.ui.core.ValueState.Error);
                    oOtpInput.setValueStateText("Please enter a valid 6-digit OTP.");
                    this._oValidatingBusyDialog.close();
                    return;
                }

                // Prepare the Twilio Verify Check API details
                const accountSid = "ACd2aa0faa93339ceb8b1f3aad47fc1c80";  // Constant.oAccountSID;
                const authToken = "f1cf11fa75eefd1d2bc7640fc23639f3";   // Constant.oAuthToken;
                const serviceSid = "VA86b64328119f75c18392bdd98fd32546",   // Constant.oServiceID;
                    url = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`,
                    payload = {
                        To: this._storedPhoneNumber,
                        Code: sEnteredOtp
                    };

                // Make the AJAX request to Twilio to verify the OTP
                $.ajax({
                    url: url,
                    type: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(payload),
                    success: function (data) {
                        if (data.status === "approved") {
                            // close the busy dailog
                            that._oValidatingBusyDialog.close();
                            // hide the validattion elements
                            that.getView().byId("_IDGenregeHBosx5").setVisible(false)
                            oOtpInput.setValue("")
                            oMobileinput.setValueState(sap.ui.core.ValueState.Success);
                            that.getView().byId("_IDGenButtson4").setEnabled(true)
                            that.getView().byId("idOTPBtn").setEnabled(false)
                            sap.m.MessageToast.show('OTP validation successfull...!');
                            this.getView().byId("_IDGenInpuseft4").setEditable(false)
                            // set otp input value state to none 
                            oOtpInput.setValueState("None");
                            // Proceed with further actions
                        } else {
                            // close the busy dailog
                            that._oValidatingBusyDialog.close();
                            oOtpInput.setValueState(sap.ui.core.ValueState.Error);
                            oOtpInput.setValueStateText("Invalid OTP");
                            sap.m.MessageToast.show('Invalid OTP...!');
                        }
                    }.bind(that),
                    error: function (xhr, status, error) {
                        that._oValidatingBusyDialog.close();
                        console.error('Error verifying OTP:', error);
                        sap.m.MessageToast.show('Failed to verify OTP: ' + error);

                    }
                })
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
                        message: "Password\n*At least 8 characters long.\n*Contains at least one Uppercase.\n*Contains at least one special character (e.g., @, #, $, etc.).\n*Contains at least one numeric digit."
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
                if (oPayload.password !== oUserView.byId("_IDGenInpust6").getValue()) {
                    sap.m.MessageBox.information("Password must match");
                    oUserView.byId("_IDGenInpust6").setValueState("Error")
                    oUserView.byId("_IDGenInpust6").setValueStateText("Password must match")
                    return;
                } else {
                    oUserView.byId("_IDGenInpust6").setValueState("None")
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
                    const sActualPass = oPayload.password
                    // Use SHA256 for hashing (CryptoJS )
                    const sEncrytpedPass = CryptoJS.SHA256(sActualPass).toString(); // encryption with CryptoJS
                    oPayload.password = sEncrytpedPass

                    // Create a record with payload
                    await this.createData(oModel, oPayload, sPath);
                    sap.m.MessageToast.show("Signup Successfull");
                    this.oSignUpDialog.close();
                    oUserView.byId("_IDGenInpust6").setValue("")
                    oUserView.byId("_IDGenInpuseft4").setEditable(true);
                    oUserView.byId("_IDGenButtson4").setEnabled(false)
                    // Send the generated UserID to User
                    // NOTE : Give credentilas here to send User ID to Registerd Mobile number 
                    const accountSid = "",
                        authToken = "",
                        url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                        fromNumber = '+15856485867';
                    $.ajax({
                        url: url,
                        type: 'POST',
                        async: true,
                        headers: {
                            'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                        },
                        data: {
                            To: `+91${oPayload.Phonenumber}`,
                            From: fromNumber,
                            Body: `Hi ${oPayload.Firstname} your login ID for Capacity Management Application is ${oPayload.userID} don't share with anyone. \nThank You,\nArtihcus Global.`
                        },
                        success: function (data) {
                            sap.m.MessageBox.show('Login ID will be sent via SMS to your mobile number');
                        },
                        error: function (error) {
                            sap.m.MessageBox.information(`Failed to send SMS.\nyour user ID is ${oPayload.userID} please note this for future use`);
                            console.error('Failed to send user ID' + error.message);
                        }
                    });
                    // SMS END
                    // set the empty data after successful creation
                    this.getView().getModel("UserModel").setProperty("/", {});
                } catch (error) {
                    sap.m.MessageToast.show("Something went wrong try again later....");
                    console.error("Failed to create record." + error);
                }
            },
        });
    });