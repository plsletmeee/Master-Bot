import React from "react";
import { trpc } from "../../utils/trpc";

const WelcomeMessageChannelPicker = ({ guildId }: { guildId: string }) => {
  const { data: channelData, isLoading: isLoadingChannelData } = trpc.useQuery([
    "welcome.get-channel",
    {
      guildId,
    },
  ]);

  const [value, setValue] = React.useState(
    channelData?.guild?.welcomeMessageChannel
  );

  const { data, isLoading } = trpc.useQuery([
    "channel.get-all",
    {
      guildId,
    },
  ]);

  const { mutate } = trpc.useMutation("welcome.set-channel");

  return (
    <div className="flex flex-col">
      <label>Welcome Message Channel</label>
      {isLoading && !data && isLoadingChannelData && !channelData ? (
        <div>Loading channels...</div>
      ) : (
        <div className="flex flex-col">
          <select
            className="w-56 bg-black text-white"
            value={value ? value : ""}
            onChange={(e) => setValue(e.target.value)}
          >
            {data?.channels.map((channel) => (
              <option value={channel.id} key={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
          <button
            className="w-fit"
            type="submit"
            onClick={() => {
              if (!value) return;
              mutate({
                guildId,
                channelId: value,
              });
            }}
          >
            Set Channel
          </button>
        </div>
      )}
    </div>
  );
};

export default WelcomeMessageChannelPicker;
