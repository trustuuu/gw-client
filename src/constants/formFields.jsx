const loginFields=[
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields=[
    {
        labelText:"Username",
        labelFor:"username",
        id:"username",
        name:"username",
        type:"text",
        autoComplete:"username",
        isRequired:true,
        placeholder:"Username"   
    },
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirm-password",
        id:"confirm-password",
        name:"confirm-password",
        type:"password",
        autoComplete:"confirm-password",
        isRequired:true,
        placeholder:"Confirm Password"   
    }
]

const domainFields=[
    {
        labelText:"Domain Name",
        labelFor:"domainName",
        id:"name",
        name:"name",
        type:"text",
        autoComplete:"name",
        isRequired:true,
        placeholder:"Domain Name"   
    },
    {
        labelText:"Description",
        labelFor:"description",
        id:"description",
        name:"description",
        type:"text",
        autoComplete:"description",
        isRequired:true,
        placeholder:"Description"   
    },
    // {
    //     labelText:"Primary",
    //     labelFor:"primary",
    //     id:"primary",
    //     name:"primary",
    //     type:"checkbox",
    //     autoComplete:"primary",
    //     isRequired:false,
    //     placeholder:"Primary",
    //     customClass: "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
    // }
]

const companyFields=[
    {
        labelText:"Company Name",
        labelFor:"name",
        id:"name",
        name:"name",
        type:"text",
        autoComplete:"name",
        isRequired:true,
        placeholder:"Company Name"   
    },
    {
        labelText:"Display Name",
        labelFor:"displayName",
        id:"displayName",
        name:"displayName",
        type:"text",
        autoComplete:"displayName",
        isRequired:true,
        placeholder:"Display Name"   
    },
    {
        labelText:"Description",
        labelFor:"description",
        id:"description",
        name:"description",
        type:"text",
        autoComplete:"description",
        isRequired:true,
        placeholder:"Description"   
    },
    // {
    //     labelText:"Primary",
    //     labelFor:"primary",
    //     id:"primary",
    //     name:"primary",
    //     type:"checkbox",
    //     autoComplete:"primary",
    //     isRequired:false,
    //     placeholder:"Primary",
    //     customClass: "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"   
    // }
    // ,
    {
        labelText:"Type",
        labelFor:"type",
        id:"type",
        name:"type",
        type:"select",
        autoComplete:"type",
        isRequired:false,
        placeholder:"Type",
        list: [{key:'customer', value:'Customer'}, {key:'reseller', value:'Reseller'}],
        reseller: true   
    }
]

const userFields=[
    {
        labelText:"User Name",
        labelFor:"username",
        id:"username",
        name:"username",
        type:"text",
        autoComplete:"username",
        isRequired:true,
        placeholder:"User Name",
    },
    {
        labelText:"Display Name",
        labelFor:"displayName",
        id:"displayName",
        name:"displayName",
        type:"text",
        autoComplete:"displayName",
        isRequired:true,
        placeholder:"Display Name",
    },
    {
        labelText:"Notes",
        labelFor:"notes",
        id:"notes",
        name:"notes",
        type:"textarea",
        autoComplete:"notes",
        isRequired:false,
        placeholder:"Notes",
    },
    {
        labelText:"Email",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"text",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email",
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"authVerification",
        name:"authVerification",
        type:"password",
        autoComplete:"authVerification",
        isRequired:true,
        placeholder:"Password",
        hiddenUpdate:true,
        hiddenDisplay:true
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirmPassword",
        id:"confirmPassword",
        name:"confirmPassword",
        type:"password",
        autoComplete:"confirmPassword",
        isRequired:true,
        placeholder:"Confirm Password",   
        database:false,
        hiddenUpdate:true,
        hiddenDisplay:true
    },
]

const groupFields=[
    {
        labelText:"Group Name",
        labelFor:"name",
        id:"name",
        name:"name",
        type:"text",
        autoComplete:"name",
        isRequired:true,
        placeholder:"Group Name",
    },
    {
        labelText:"Display Name",
        labelFor:"displayName",
        id:"displayName",
        name:"displayName",
        type:"text",
        autoComplete:"displayName",
        isRequired:true,
        placeholder:"Display Name",
    },
    {
        labelText:"Notes",
        labelFor:"notes",
        id:"notes",
        name:"notes",
        type:"textarea",
        autoComplete:"notes",
        isRequired:false,
        placeholder:"Notes",
    },
    {
        labelText:"Email",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"text",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email",
    }
]

const applicationFields=[
    {
        labelText:"Application Name",
        labelFor:"client_name",
        id:"client_name",
        name:"client_name",
        type:"text",
        autoComplete:"client_name",
        isRequired:true,
        placeholder:"Application Name",
        category:'settings.basic'
    },
    {
        labelText:"Domain",
        labelFor:"domain",
        id:"domain",
        name:"domain",
        type:"text",
        autoComplete:"domain",
        isRequired:true,
        placeholder:"Domain",
        category:'settings.basic'
    },
    {
        labelText:"Client Id",
        labelFor:"client_id",
        id:"client_id",
        name:"client_id",
        type:"text",
        autoComplete:"client_id",
        isRequired:false,
        placeholder:"Client Id",
        category:'settings.basic'
    },
    {
        labelText:"Client Secret",
        labelFor:"client_secret",
        id:"client_secret",
        name:"client_secret",
        type:"text",
        autoComplete:"client_secret",
        isRequired:true,
        placeholder:"Client Secret",
        category:'settings.basic'
    },
    {
        labelText:"Description",
        labelFor:"description",
        id:"description",
        name:"description",
        type:"textarea",
        autoComplete:"description",
        isRequired:false,
        placeholder:"Description",
        category:'settings.basic'
    },
    {
        labelText:"Application Logo",
        labelFor:"logo_uri",
        id:"logo_uri",
        name:"logo_uri",
        type:"text",
        autoComplete:"logo_uri",
        isRequired:false,
        placeholder:"Application Logo",
        category:'settings.properties'
    },    
    {
        labelText:"Application Type",
        labelFor:"app_type",
        id:"app_type",
        name:"app_type",
        type:"select",
        autoComplete:"app_type",
        isRequired:false,
        placeholder:"Application Logo",
        list: [{key:'SPA', value:'Single Page Web Applications'},
                {key:'native', value:'Regular Web Applications'}, 
                {key:'native', value:'Native'}, 
                {key:'machine', value:'Machine to Machine Applications'}],
        category:'settings.properties'
    },
    {
        labelText:"Application Login URI",
        labelFor:"client_uri",
        id:"client_uri",
        name:"client_uri",
        type:"text",
        autoComplete:"client_uri",
        isRequired:false,
        placeholder:"Application Login URI",
        category:'settings.uris'
    },
    {
        labelText:"Application Logout URI",
        labelFor:"client_logout_uri",
        id:"client_logout_uri",
        name:"client_logout_uri",
        type:"textarea",
        valueType: 'array',
        autoComplete:"client_logout_uri",
        isRequired:false,
        placeholder:"Application Logout URI",
        category:'settings.uris'
    },
    {
        labelText:"Allowed Callback URLs",
        labelFor:"redirect_uris",
        id:"redirect_uris",
        name:"redirect_uris",
        type:"textarea",
        valueType: 'array',
        autoComplete:"redirect_uris",
        isRequired:false,
        placeholder:"Allowed Callback URLs",
        category:'settings.uris'
    },
    {
        labelText:"Allowed Web Orgins",
        labelFor:"allowed_web_orgins",
        id:"allowed_web_orgins",
        name:"allowed_web_orgins",
        type:"textarea",
        valueType: 'array',
        autoComplete:"allowed_web_orgins",
        isRequired:false,
        placeholder:"Allowed Web Orgins",
        category:'settings.uris'
    },
    {
        labelText:"ID Token Expiration",
        labelFor:"id_token_expiration",
        id:"id_token_expiration",
        name:"id_token_expiration",
        type:"text",
        autoComplete:"id_token_expiration",
        isRequired:false,
        placeholder:"36000 seconds",
        category:'settings.idToken'
    },
    {
        labelText:"Rotation",
        labelFor:"refresh_token_rotation",
        id:"refresh_token_rotation",
        name:"refresh_token_rotation",
        type:"checkbox",
        autoComplete:"refresh_token_rotation",
        isRequired:false,
        placeholder:"Rotation",
        category:'settings.refreshTokenRotation'
    },
    {
        labelText:"Reuse Interval",
        labelFor:"refresh_reuse_interval",
        id:"refresh_reuse_interval",
        name:"refresh_reuse_interval",
        type:"text",
        autoComplete:"refresh_reuse_interval",
        isRequired:false,
        placeholder:"0 seconds",
        category:'settings.refreshTokenRotation'
    },
    {
        labelText:"Absolute Expiration",
        labelFor:"refresh_absolute_expiration",
        id:"refresh_absolute_expiration",
        name:"refresh_absolute_expiration",
        type:"checkbox",
        autoComplete:"refresh_absolute_expiration",
        isRequired:false,
        placeholder:"0 seconds",
        category:'settings.refreshTokenExpiration'
    },
    {
        labelText:"Absolute Lifetime",
        labelFor:"refresh_absolute_lifetime",
        id:"refresh_absolute_lifetime",
        name:"refresh_absolute_lifetime",
        type:"text",
        autoComplete:"refresh_absolute_lifetime",
        isRequired:false,
        placeholder:"31557600 seconds",
        category:'settings.refreshTokenExpiration'
    },
    {
        labelText:"Grant Types",
        labelFor:"grant_types",
        id:"grant_types",
        name:"grant_types",
        type:"select",
        list: [
                {key:'implicit', value:'Implicit'},
                {key:'authorization_code', value:'Authorization Code'}, 
                {key:'refresh_token', value:'Refresh Token'}, 
                {key:'client_credentials', value:'Client Credentials'},
                {key:'password', value:'Password'},
                {key:'MFA', value:'MFA'},
                {key:'passwordless_otp', value:'Passwordless OTP'},
            ],
        autoComplete:"grant_types",
        isRequired:false,
        placeholder:"Grant Types",
        category:'settings.advanced'
    }
]

const apiFields=[
    {
        labelText:"Name",
        labelFor:"name",
        id:"name",
        name:"name",
        type:"text",
        autoComplete:"name",
        isRequired:true,
        placeholder:"Name",
        category:'settings.general'
    },
    {
        labelText:"Domain",
        labelFor:"domain",
        id:"domain",
        name:"domain",
        type:"text",
        autoComplete:"domain",
        isRequired:true,
        placeholder:"Domain",
        category:'settings.general'
    },
    {
        labelText:"Identifier",
        labelFor:"identifier",
        id:"identifier",
        name:"identifier",
        type:"text",
        autoComplete:"identifier",
        isRequired:true,
        placeholder:"Identifier",
        category:'settings.general'
    },
    {
        labelText:"Token Expiration (Seconds)",
        labelFor:"tokenExpiration",
        id:"tokenExpiration",
        name:"tokenExpiration",
        type:"text",
        autoComplete:"tokenExpiration",
        isRequired:false,
        placeholder:"86400 seconds",
        category:'settings.tokenSetting'
    },
    {
        labelText:"Token Expiration For Browser Flows (Seconds)",
        labelFor:"tokenExpirationBrowser",
        id:"tokenExpirationBrowser",
        name:"tokenExpirationBrowser",
        type:"text",
        autoComplete:"tokenExpirationBrowser",
        isRequired:false,
        placeholder:"7200 seconds",
        category:'settings.tokenSetting'
    },
    {
        labelText:"Signing Algorithm",
        labelFor:"signingAlgorithm",
        id:"signingAlgorithm",
        name:"signingAlgorithm",
        type:"select",
        autoComplete:"signingAlgorithm",
        isRequired:false,
        placeholder:"Signing Algorithm",
        list: [{key:'RS256', value:'RS256'}, {key:'HS256', value:'HS256'}],
        category:'settings.tokenSetting'
    },
    {
        labelText:"RBAC",
        labelFor:"RBAC",
        id:"RBAC",
        name:"RBAC",
        type:"checkbox",
        autoComplete:"RBAC",
        isRequired:false,
        placeholder:"RBAC",
        category:'settings.rbac'
    },
    {
        labelText:"Add Permission in Access Token",
        labelFor:"addPermissionAccessToken",
        id:"addPermissionAccessToken",
        name:"addPermissionAccessToken",
        type:"checkbox",
        autoComplete:"addPermissionAccessToken",
        isRequired:false,
        placeholder:"Add Permission in Access Token",
        category:'settings.rbac'
    },
    {
        labelText:"Allow Skipping User Consent",
        labelFor:"allowSkippingUserConsent",
        id:"allowSkippingUserConsent",
        name:"allowSkippingUserConsent",
        type:"checkbox",
        autoComplete:"allowSkippingUserConsent",
        isRequired:false,
        placeholder:"Allow Skipping User Consent",
        category:'settings.access'
    },
    {
        labelText:"Allow Offline Access",
        labelFor:"allowOfflineAccess",
        id:"allowOfflineAccess",
        name:"allowOfflineAccess",
        type:"checkbox",
        autoComplete:"allowOfflineAccess",
        isRequired:false,
        placeholder:"Allow Offline Access",
        category:'settings.access'
    }
    
]

const apiPermissionScopesFields=[
    {
        labelText:"Permission",
        labelFor:"permission",
        id:"permission",
        name:"permission",
        type:"text",
        autoComplete:"permission",
        isRequired:true,
        placeholder:"Permission",
        category:'settings.access.permission'
    },
    {
        labelText:"Description",
        labelFor:"description",
        id:"description",
        name:"description",
        type:"text",
        autoComplete:"description",
        isRequired:true,
        placeholder:"Description",
        category:'settings.access.permission'
    }
]

//signingAlgorithm
export {loginFields,signupFields, domainFields, companyFields, userFields, groupFields, applicationFields, apiFields, apiPermissionScopesFields}