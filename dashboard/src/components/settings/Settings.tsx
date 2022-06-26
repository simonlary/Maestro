import { useRegisterCommandsMutation } from "../../apollo/generated";
import { Button } from "../controls/Button";
import { SettingsCard } from "./SettingsCard";

export function Settings() {
  const [registerCommands] = useRegisterCommandsMutation();

  async function onClick() {
    await registerCommands();
    alert("Done!");
  }

  return (
    <div className="pt-2 flex justify-center">
      <div className="flex flex-col items-center p-4 gap-4 w-full sm:w-2/3 lg:w-1/2 2xl:w-1/3">
        <SettingsCard>
          <div className="flex flex-col gap-2">
            <h1>Register commands</h1>
            <div>This buttons registers the bot&apos;s commands. This is rate-limited by discord.</div>
            <Button text="Register" size="md" className="w-36 mt-2" onClick={onClick} />
          </div>
        </SettingsCard>
        <SettingsCard>
          <div className="flex flex-col gap-2">
            <h1>Restart bot</h1>
            <div>This button will restart the bot. Any media being played will stop.</div>
            <Button text="Restart" size="md" variant="destructive" className="w-36 mt-2" />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
