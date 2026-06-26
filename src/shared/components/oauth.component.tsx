import googleIcon from "@/assets/svgs/devicon_google.svg";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CredentialResponse,
  useGoogleOAuth,
} from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { google_login_team_member } from "@/config/services/auth.service";
import useAuthStore from "@/config/stores/auth.store";
import { TeamMember } from "@/shared/typings/team-member";
import {
  getPostLoginPath,
  persistAuthSession,
} from "@/auth/utils/auth-success.utils";
import { getGoogleAuthErrorMessage } from "@/auth/utils/google-auth-error.utils";
import { getDeviceInfo } from "@/shared/utils/device-info.utils";

interface OauthProps {
  onError?: (title: string, description: string) => void;
}

function Oauth({ onError }: OauthProps) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const hiddenButtonRef = useRef<HTMLDivElement>(null);
  const credentialReceivedRef = useRef(false);
  const [isGoogleUiPending, setIsGoogleUiPending] = useState(false);

  const { mutate, isPending: isApiPending } = useMutation<
    GeneralReturnInt<TeamMember>,
    Error,
    string
  >({
    mutationFn: (idToken) =>
      google_login_team_member({
        id_token: idToken,
        device_info: getDeviceInfo(),
      }),
    onSuccess: (response) => {
      if (!response?.data) {
        onError?.(
          "Google sign-in failed",
          "Unable to retrieve user data. Please try again.",
        );
        return;
      }

      persistAuthSession(response.data, login);
      navigate(getPostLoginPath(response.data.user));
    },
    onError: (error) => {
      onError?.("Google sign-in failed", getGoogleAuthErrorMessage(error));
    },
    onSettled: () => {
      setIsGoogleUiPending(false);
    },
  });

  const handleCredentialResponse = useCallback(
    (credentialResponse: CredentialResponse) => {
      credentialReceivedRef.current = true;
      const idToken = credentialResponse.credential;

      if (!idToken) {
        setIsGoogleUiPending(false);
        onError?.(
          "Google sign-in failed",
          "No credential received. Please try again.",
        );
        return;
      }

      mutate(idToken);
    },
    [mutate, onError],
  );

  const handleCredentialResponseRef = useRef(handleCredentialResponse);

  useEffect(() => {
    handleCredentialResponseRef.current = handleCredentialResponse;
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (!scriptLoadedSuccessfully || !clientId || !hiddenButtonRef.current) {
      return;
    }

    if (!window.google?.accounts?.id) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) =>
        handleCredentialResponseRef.current(
          response as CredentialResponse,
        ),
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(hiddenButtonRef.current, {
      type: "standard",
      size: "large",
      text: "continue_with",
      theme: "outline",
      width: 300,
    });
  }, [scriptLoadedSuccessfully, clientId]);

  const isPending = isGoogleUiPending || isApiPending;

  const handleGoogleClick = () => {
    if (isPending || !scriptLoadedSuccessfully) {
      return;
    }

    credentialReceivedRef.current = false;
    setIsGoogleUiPending(true);

    const onWindowFocus = () => {
      window.setTimeout(() => {
        if (!credentialReceivedRef.current) {
          setIsGoogleUiPending(false);
        }
      }, 500);
      window.removeEventListener("focus", onWindowFocus);
    };

    window.addEventListener("focus", onWindowFocus);

    const googleBtn = hiddenButtonRef.current?.querySelector(
      'div[role="button"]',
    ) as HTMLElement | null;

    if (googleBtn) {
      googleBtn.click();
      return;
    }

    setIsGoogleUiPending(false);
    onError?.(
      "Google sign-in unavailable",
      "Google sign-in is not ready yet. Please try again.",
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center w-full my-2 relative">
        <div className="w-full h-0.5 bg-black opacity-10" />
        <p className="text-[#454950] text-[1rem] font-medium absolute top-1/2 -translate-y-1/2 px-4 py-2 bg-white z-10">
          or 
        </p>
      </div>
      <div className="relative mt-[17px] w-full">
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isPending || !scriptLoadedSuccessfully}
          className="border border-[#6B72804F] hover:bg-black/10 transition-all duration-300 h-10 sm:h-[2.543rem] md:h-12 rounded-[9px] flex w-full items-center justify-center py-[7px] px-[13px] gap-[10px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#6B7280]" />
          ) : (
            <img src={googleIcon} alt="" aria-hidden="true" />
          )}
          <span className="text-[#6B7280] font-medium text-[1rem]">
            {isPending ? "Signing in..." : "Continue with Google"}
          </span>
        </button>
        <div
          ref={hiddenButtonRef}
          className="absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function OauthGate(props: OauthProps) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return null;
  }

  return <Oauth {...props} />;
}

export default OauthGate;