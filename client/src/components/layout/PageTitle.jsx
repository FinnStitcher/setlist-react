function PageTitle({ title, children }) {
	return (
		<div className="page-title">
			<h2>{title}</h2>

			{children}
		</div>
	);
}

export default PageTitle;
