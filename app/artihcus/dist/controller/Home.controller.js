sap.ui.define(["./BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/core/UIComponent"],function(o,i,n,t){"use strict";return o.extend("com.app.artihcus.controller.Home",{onInit(){n.information("Hey there Developement in progress")},onLogin:async function(){if(!this.oLoginDialog){this.oLoginDialog=await this.loadFragment("login")}this.oLoginDialog.open()},oncancelbtn:function(){if(this.oLoginDialog.isOpen()){this.oLoginDialog.close()}},onSignup:async function(){if(!this.oSignUpDialog){this.oSignUpDialog=await this.loadFragment("SignUp")}this.oSignUpDialog.open()},onCancelPressInSignUp:function(){if(this.oSignUpDialog.isOpen()){this.oSignUpDialog.close()}},onLoginBtnPressInLoginDialog:function(){var o=t.getRouterFor(this);o.navTo("MainPage")}})});
//# sourceMappingURL=Home.controller.js.map