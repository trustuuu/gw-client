import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TabHeader from '../../component/tabs/TabHeader';
import TabBody from '../../component/tabs/TabBody';
import GroupPost from './GroupPost';
import GroupMemberPage from './GroupMemberPage';

function GroupView() {
    const location = useLocation();

    const {company, domain, group, mode} = location.state;

	const data = [
        {
            title: "General",
            content: <GroupPost mode={mode} company={company} domain={domain} group={group}/>
        },
        {
            title: "Members",
            content: <GroupMemberPage mode={mode} company={company} domain={domain} group={group}/>,
            closeButton: true
        }
    ];

	const [visibleTab, setVisibleTab] = useState(0);

	return (
		<div className="w-full">
			<TabHeader data={data}
				visibleTab={visibleTab}
				setVisibleTab={setVisibleTab} />
			<TabBody data={data}
				visibleTab={visibleTab} />
		</div>
	);
}

export default GroupView;
