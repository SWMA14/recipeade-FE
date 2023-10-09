import { registerPlugin } from "@capacitor/core";

const _pluginName: string = "SignInWithApple";

export interface SignInWithApplePlugin
{
    authorize(options?: SignInWithAppleOptions): Promise<SignInWithAppleResponse>;
}

export interface SignInWithAppleOptions
{
    clientId: string;
    redirectURI: string;
    scopes?: string;
    state?: string;
    nonce?: string;
}

export interface SignInWithAppleResponse
{
    response: {
        user: string | null;
        email: string | null;
        givenName: string | null;
        familyName: string | null;
        identityToken: string;
        authorizationCode: string;
    };
}

export const SignInWithApple = registerPlugin<SignInWithApplePlugin>(_pluginName);