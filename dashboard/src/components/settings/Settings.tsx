import { useRegisterCommandsMutation, useRestartMutation, useSettingsQuery } from "../../apollo/generated";
import { Button } from "../controls/Button";
import { SettingsCard } from "./SettingsCard";

export function Settings() {
  const { data, refetch } = useSettingsQuery();
  const [registerCommands] = useRegisterCommandsMutation();
  const [restartCommand] = useRestartMutation();

  async function onRegisterCommandsClick() {
    const result = await registerCommands();
    if (result.errors || result.data == null || !result.data.registerCommands) {
      alert("Registering commands failed!");
    }

    refetch();
  }

  const disableRegisterButton = data?.settings.hasAlreadyRegisteredCommands ?? true;

  return (
    <div className="pt-2 flex justify-center">
      <div className="flex flex-col items-center p-4 gap-4 w-full sm:w-2/3 lg:w-1/2 2xl:w-1/3">
        <SettingsCard>
          <div className="flex flex-col gap-2">
            <h1>Register commands</h1>
            <div>This buttons registers the bot&apos;s commands. This is rate-limited by discord.</div>
            <Button
              text={disableRegisterButton ? "Already registered" : "Register"}
              size="md"
              className="w-44 mt-2"
              onClick={onRegisterCommandsClick}
              disabled={disableRegisterButton}
            />
          </div>
        </SettingsCard>
        <SettingsCard>
          <div className="flex flex-col gap-2">
            <h1>Restart bot</h1>
            <div>This button will restart the bot. Any media being played will stop.</div>
            <Button
              text="Restart"
              size="md"
              variant="destructive"
              className="w-44 mt-2"
              onClick={() => restartCommand()}
            />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
