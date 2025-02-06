import * as Icons from "lucide-react"; // Import icon dari lucide-react

interface clientRoute {
    title: string;
    link: string;
    icon?: React.ElementType;
    children?: clientRoute[];
}

interface adminRoute {
	title: string;
	label: string;
	icon?: React.ElementType;
	variant: 'default' | 'ghost';
	link: string;
}

export const clientRoutes: clientRoute[] = [
    {
		title: 'Home',
		link: '/pageClient/home',
		icon: Icons.Home
	},
	{
		title: 'Lysa AI',
		link: '/pageClient/lysa-ai/monitoring',
		icon: Icons.LayoutDashboard,
		children: [
			{
				title: 'Media Monitoring',
				link: '/pageClient/lysa-ai/monitoring',
				icon: Icons.CircleDot
			},
			{
				title: 'Netizen Monitoring',
				link: '/pageClient/lysa-ai/profiling',
				icon: Icons.CircleDot
			}
		]
	},
	{
		title: 'Perform',
		link: '/pageClient/competitor/daily',
		icon: Icons.UserRoundSearch,
		children: [
			{
				title: 'Daily',
				link: '/pageClient/competitor/daily',
				icon: Icons.CircleDot
			},
			{
				title: 'Monthly',
				link: '/pageClient/competitor/monthly',
				icon: Icons.CircleDot
			}
		]
	},
];

export const adminRoutes: adminRoute[] = [
    {
        title: 'Home',
        link: '/pageAdmin/home',
        label: '',
        icon: Icons.Home,
        variant: 'default'
    },
    {
        title: 'News Portals',
        link: '/pageAdmin/news-portals',
        label: '',
        icon: Icons.Newspaper,
        variant: 'default'
    },
    {
        title: 'Cities',
        link: '/pageAdmin/cities',
        label: '',
        icon: Icons.Landmark,
        variant: 'default'
    },
    {
        title: 'Professions',
        link: '/pageAdmin/professions',
        label: '',
        icon: Icons.Medal,
        variant: 'default'
    },
    {
        title: 'Profiling',
        link: '/pageAdmin/profilings',
        label: '',
        icon: Icons.Users,
        variant: 'default'
    },
    {
        title: 'Issue',
        link: '/pageAdmin/issues',
        label: '',
        icon: Icons.ScanEye,
        variant: 'default'
    },
    {
        title: 'Issue Group',
        link: '/pageAdmin/issue-groups',
        label: '',
        icon: Icons.Newspaper,
        variant: 'default'
    },
    {
        title: 'Issue Keyword',
        link: '/pageAdmin/issue-keywords',
        label: '',
        icon: Icons.Tag,
        variant: 'default'
    },
    {
        title: 'News',
        link: '/pageAdmin/news',
        label: '',
        icon: Icons.ScanEye,
        variant: 'default'
    },
    {
        title: 'Comment Issues',
        link: '/pageAdmin/comment-issues',
        label: '',
        icon: Icons.MessageSquareWarning,
        variant: 'default'
    },
    {
        title: 'Comments',
        link: '/pageAdmin/comments',
        label: '',
        icon: Icons.MessageSquareWarning,
        variant: 'default'
    },
    {
        title: 'Tracking Menu',
        link: '/pageAdmin/tracking-menu',
        label: '',
        icon: Icons.BarChartBig,
        variant: 'default'
    },
    {
        title: 'Crawler Engine',
        link: '/pageAdmin/crawler-engine',
        label: '',
        icon: Icons.Cpu,
        variant: 'default'
    },
    {
        title: 'Crawling Targets',
        link: '/pageAdmin/crawling-targets',
        label: '',
        icon: Icons.SearchCheck,
        variant: 'default'
    },
    {
        title: 'Crawling',
        link: '/pageAdmin/crawling',
        label: '',
        icon: Icons.CloudDownload,
        variant: 'default'
    },
    {
        title: 'Extraction',
        link: '/pageAdmin/extraction',
        label: '',
        icon: Icons.ExternalLink,
        variant: 'default'
    },
    {
        title: 'Normalization',
        link: '/pageAdmin/normalization',
        label: '',
        icon: Icons.ALargeSmall,
        variant: 'default'
    },
    {
        title: 'Classification',
        link: '/pageAdmin/classification',
        label: '',
        icon: Icons.Tag,
        variant: 'default'
    },
    {
        title: 'Scraping Targets',
        link: '/pageAdmin/scraping-targets',
        label: '',
        icon: Icons.SearchCheck,
        variant: 'default'
    },
    {
        title: 'Users',
        link: '/pageAdmin/users',
        label: '',
        icon: Icons.Users,
        variant: 'default'
    },
    {
        title: 'Report',
        link: '/pageAdmin/report',
        label: '',
        icon: Icons.FileX,
        variant: 'default'
    },
    {
        title: 'Pop Up',
        link: '/pageAdmin/popup',
        label: '',
        icon: Icons.MessageSquareWarning,
        variant: 'default'
    },
    {
        title: 'Contributors',
        link: '/pageAdmin/contributors',
        label: '',
        icon: Icons.Users,
        variant: 'default'
    },
];

// 🚀 Fungsi Ambil Routes Berdasarkan Role
export function getRoutesByRole(role: string) {
    if (role === "admin") {
        return adminRoutes;
    } else if (role === "client") {
        return clientRoutes;
    }
    return []; // Jangan return null, biar aman.
}


