sap.ui.define(["./BaseController","sap/m/MessageToast","sap/ui/core/UIComponent"],function(i,o,n){"use strict";return i.extend("com.app.artihcus.controller.Home",{onInit(){},onLogin:async function(){if(!this.oLoginDialog){this.oLoginDialog=await this.loadFragment("login")}this.oLoginDialog.open()},oncancelbtn:function(){if(this.oLoginDialog.isOpen()){this.oLoginDialog.close()}},onSignup:async function(){if(!this.oSignUpDialog){this.oSignUpDialog=await this.loadFragment("SignUp")}this.oSignUpDialog.open()},onCancelPressInSignUp:function(){if(this.oSignUpDialog.isOpen()){this.oSignUpDialog.close()}},onLoginBtnPressInLoginDialog:function(){var i=n.getRouterFor(this);i.navTo("MainPage")}})});
//# sourceMappingURL=Home.controller.js.map