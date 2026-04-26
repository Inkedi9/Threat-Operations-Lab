import EmailCard from "./EmailCard";

export default function InboxList({ emails, selectedEmail, onSelect, completedIds }) {
    return (
        <div className="space-y-3">
            {emails.map((email) => (
                <EmailCard
                    key={email.id}
                    email={email}
                    selected={selectedEmail?.id === email.id}
                    completed={completedIds.includes(email.id)}
                    onClick={() => onSelect(email)}
                />
            ))}
        </div>
    );
}