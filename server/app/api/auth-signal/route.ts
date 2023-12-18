export const dynamic = "force-dynamic"; // defaults to force-static
import { Authsignal } from "@authsignal/node";

const authsignal = new Authsignal({
  secret: "YOLUo9oaljcvifoTom+rREme4KsguU7HqL1960EErhF0o1eW5wiwHA==",
  // apiBaseUrl: "https://api.authsignal.com/v1",
});

export async function GET() {
  // console.log("here");
  const result = await authsignal.track({
    userId: "usr_123",
    action: "signin",
  });

  // console.log("********#*#*#*##*#*#* imn heree");
  // console.log({ state: result.state });
  // if (result.state === "CHALLENGE_REQUIRED") {
  // The user should be presented with a challenge
  return Response.json(result);
  // }
}
