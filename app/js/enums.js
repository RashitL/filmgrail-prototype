var eSentiments = {
    question: 1,
    praise: 2,
    suggestion: 3,
    complaint: 4,
    '1': 'question',
    '2': 'praise',
    '3': 'suggestion',
    '4': 'complaint',
    '': ''
};

var eSource = {
    web: 0,
    facebook: 1,
    twitter: 2,
    email: 3,
    '0': 'web',
    '1': 'facebook',
    '2': 'twitter',
    '3': 'email',
    '': ''
};

var eFolder = {
    0: 'inbox',
    1: 'needs-attention',
    2: 'forwarded',
    3: 'expiring',
    4: 'archived',
    5: 'trash',
    6: 'spam',
    7: 'draft',
    8: 'lockedByMe',
    9: 'assignedToMe',
    'inbox': 0,
    'needs-attention': 1,
    'forwarded': 2,
    'expiring': 3,
    'archived': 4,
    'trash': 5,
    'spam': 6,
    'draft': 7,
    'lockedByMe': 8,
    'assignedToMe': 9,
    '': ''
};

var eVisibility = {
    public: false,
    private: true,
    '': ''
};

var eOrderBy = {
    'date-asc': 0,
    'date-desc': 1,
    'thread-asc': 2,
    'thread-desc': 3,
    'last-activity-asc': 4,
    'last-activity-desc': 5,
    '': 1
};