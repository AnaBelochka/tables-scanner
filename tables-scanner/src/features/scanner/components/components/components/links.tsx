import { XCircle, Globe, MessageCircle, Send } from 'lucide-react';
import { TokenLinks } from '../../../types';

type Props = {
  link: string;
  icon: React.ReactNode;
};

const Link = ({ link, icon }: Props) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {icon}
    </a>
  );
};

export const Links = ({ webLink, discordLink, telegramLink, twitterLink }: TokenLinks) => {
  if (!webLink && !discordLink && !telegramLink && !twitterLink) {
    return null;
  }

  const iconClass = 'text-gray-400 hover:text-white transition';

  return (
    <div className="flex gap-2">
      {twitterLink && (
        <Link link={twitterLink} icon={<XCircle width={20} height={20} className={iconClass} />} />
      )}
      {discordLink && (
        <Link
          link={discordLink}
          icon={<MessageCircle width={20} height={20} className={iconClass} />}
        />
      )}
      {telegramLink && (
        <Link link={telegramLink} icon={<Send width={20} height={20} className={iconClass} />} />
      )}
      {webLink && (
        <Link link={webLink} icon={<Globe width={20} height={20} className={iconClass} />} />
      )}
    </div>
  );
};
