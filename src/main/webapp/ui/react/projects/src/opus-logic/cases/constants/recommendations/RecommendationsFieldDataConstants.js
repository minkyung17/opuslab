import {fieldsInAPI as baseFields} from '../FieldDataConstants';
import deepmerge from 'deepmerge';

export const defaultAttributeProperties = {
  editable: true,
  visibility: true,
  conditional: 'Normal',
  pathToFieldValue: '',
  pathToFieldDisplayText: ''
};

export const recommendationsFields = {
  name: {
    name: 'name',
    displayName: 'Name',
    dataType: 'text',
  },
  organization: {
    name: 'organization',
    displayName: 'Organization',
    dataType: 'text'
  },
  title: {
    name: 'title',
    displayName: 'Title',
    dataType: 'text'
  },
  rank: {
    dataType: 'options',
    optionsListName: 'rank',
    pathsInAPI: {
      recommendations: {
        value: 'recommendationRankType'
      }
    }
  },
  step: {
    optionsListName: 'step',
    pathsInAPI: {
      recommendations: {
        value: 'recommendationStepType'
      }
    }
  },
  salary: {
    pathsInAPI: {
      recommendations: {
        value: 'recommendationSalaryAmt'
      }
    }
  },
  recommendation: {
    name: 'recommendation',
    displayName: 'Recommendation',
    dataType: 'options',
    optionsListName: 'recommendationOutcomes',
    pathsInAPI: {
      recommendations: {
        value: 'outComeTypeId',
        displayText: 'recommendation'
      }
    }
  },
  dateOfRecommendation: {
    name: 'dateOfRecommendation',
    displayName: 'Date of Recommendation',
    dataType: 'date',
    pathsInAPI: {
      recommendations: {
        value: 'recommendationDt',
        displayText: 'recommendationDt'
      }
    }
  },
  decision: {
    name: 'decision',
    displayName: 'Decision',
    dataType: 'options',
    optionsListName: 'recommendationOptions',
    pathsInAPI: {
      recommendations: {
        value: 'outComeTypeId',
        displayText: 'outComeTypeId'
      }
    }
  },
  required: {
    name: 'required',
    displayName: 'Required?',
    dataType: 'options',
    optionsListName: 'requiredOptions',
    pathsInAPI: {
      recommendations: {
        value: 'required',
        displayText: 'required'
      }
    }
  },
  strengthOfRecommendation: {
    name: 'strengthOfRecommendation',
    displayName: 'Strength of Recommendation',
    dataType: 'options',
    optionsListName: 'recommendationStrengthIds',
    pathsInAPI: {
      recommendations: {
        value: 'recommendationStrengthId',
        displayText: 'recommendationStrengthId'
      }
    }
  },
  typeOfCAPCommittee: {
    name: 'typeOfCAPCommittee',
    displayName: 'Type of CAP Committee',
    dataType: 'options',
    optionsListName: 'capCommitteeType',
    pathsInAPI: {
      recommendations: {
        value: 'committeeTypeId',
        displayText: 'committeeTypeId'
      }
    }
  },
  proposedRole: {
    name: 'proposedRole',
    displayName: 'Proposed Role',
    dataType: 'options',
    optionsListName: 'committeeMemberProposedRoles',
    pathsInAPI: {
      cap: {
        value: 'committeeMemberProposedRoleId',
        displayText: 'committeeMemberProposedRoleId'
      }
    }
  },
  finalRole: {
    name: 'finalRole',
    displayName: 'Final Role',
    dataType: 'options',
    optionsListName: 'committeeMemberRoles',
    pathsInAPI: {
      cap: {
        value: 'committeeMemberFinalRoleId',
        displayText: 'committeeMemberFinalRoleId'
      }
    }
  },
  dateOfDecision: {
    name: 'dateOfDecision',
    displayName: 'Date of Decision',
    dataType: 'date',
    pathsInAPI: {
      recommendations: {
        value: 'recommendationDt',
        displayText: 'recommendationDt'
      }
    }
  },
  deptVotingCommitteeResultsDt: {
    name: 'deptVotingCommitteeResultsDt',
    displayName: 'Date of Department Vote',
    dataType: 'date',
    pathsInAPI: {
      recommendations: {
        value: 'opusCase.deptVotingCommitteeResultsDt',
        displayText: 'opusCase.deptVotingCommitteeResultsDt'
      }
    }
  },
  dateOfCommitteeMembership: {
    name: 'dateOfCommitteeMembership',
    displayName: 'Date of Committee Membership Set',
    dataType: 'date',
    pathsInAPI: {
      recommendations: {
        value: 'opusCase.cAPReviewCommitteeSetupDt',
        displayText: 'opusCase.cAPReviewCommitteeSetupDt'
      }
    }
  },
  dateOfMeeting: {
    name: 'dateOfMeeting',
    displayName: 'Date of Meeting',
    dataType: 'date',
    pathsInAPI: {
      recommendations: {
        value: 'opusCase.cAPReviewCommitteeMeetingDt',
        displayText: 'opusCase.cAPReviewCommitteeMeetingDt'
      }
    }
  },
  dateReportSubmittedToAPO: {
    name: 'dateReportSubmittedToAPO',
    displayName: 'Date Report Submitted to APO',
    dataType: 'date',
    pathsInAPI: {
      recommendations: {
        value: 'opusCase.cAPReviewCommitteeReportToAPODt',
        displayText: 'opusCase.cAPReviewCommitteeReportToAPODt'
      }
    }
  },
  dateReportSentToDean: {
    name: 'dateReportSentToDean',
    editable: true,
    dataType: 'date',
    displayName: 'Date Report Sent to Dean',
    pathsInAPI: {
      recommendations: {
        value: 'opusCase.cAPReviewCommitteeReportToDeanDt',
        displayText: 'opusCase.cAPReviewCommitteeReportToDeanDt'
      }
    }
  },
  recommendationDecision: {
    name: 'recommendationDecision',
    displayName: 'Decision',
    dataType: 'options',
    optionsListName: 'recommendationOutcomes',
    pathsInAPI: {
      recommendations: {
        value: 'outComeTypeId',
        displayText: 'recommendation'
      }
    }
  },
  userComments: {
    name: 'userComments',
    label: 'Comments (Maximum 250 characters.)',
    dataType: 'textarea',
    pathsInAPI: {
      cap: {
        value: 'commentsText',
        displayText: 'commentsText'
      },
      recommendations: {
        value: 'recommendationCommentsText',
        displayText: 'recommendationCommentsText'
      }
    }
  }
};

export let fieldsInAPI = deepmerge(baseFields, recommendationsFields);
