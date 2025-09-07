import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ searchTerm, setSearchTerm }) => (
  <div className="mb-4 flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  </div>
);

export default UserSearch;
