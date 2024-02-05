interface LinkedInDetailsProps {
  certificateName: string | undefined;
  organizationId: string | undefined;
  certificateIssueYear: number | undefined;
  certificateIssueMonth: number | undefined;
  certificateURL: string | undefined;
  certificateId: string | undefined;
}

const fillLinkedInDetails = ({
  certificateName,
  organizationId,
  certificateIssueYear,
  certificateIssueMonth,
  certificateURL,
  certificateId
}: LinkedInDetailsProps) => {
  const certId = certificateId || '';
  const certUrl = certificateURL || '';
  const isFromA2p = true;
  const issueMonth = certificateIssueMonth || 0;
  const issueYear = certificateIssueYear || 0;
  const name = certificateName || '';

  const linkedInURL = `https://www.linkedin.com/profile/add?certId=${certId}&certUrl=${encodeURIComponent(
    certUrl
  )}&isFromA2p=${isFromA2p}&issueMonth=${issueMonth}&issueYear=${issueYear}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`;

  return linkedInURL;
};

const shareToLinkedIn = (params: LinkedInDetailsProps) => {
  const LinkedInDetails = fillLinkedInDetails(params);
  const link = document.createElement('a');
  link.href = LinkedInDetails;
  link.target = '_blank';
  link.click();
};

export default shareToLinkedIn;
