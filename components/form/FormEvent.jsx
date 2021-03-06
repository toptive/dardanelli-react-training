function FormEvent(props) {
  const {
    onSubmit,
    onChange,
    loading,
    stateFormData,
    stateFormError,
    stateFormValid,
    stateFormMessage,
  } = props;
  return (
    <form onSubmit={onSubmit} className="form-job card" method="POST">
      <div className="form-group">
        <h2>Form Event</h2>
        <hr />
        {stateFormMessage.status === 'error' && (
          <h4 className="warning text-center">{stateFormMessage.error}</h4>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          className="form-control"
          type="text"
          id="title"
          name="title"
          placeholder="Event Title"
          onChange={onChange}
          value={stateFormData.title.value}
        />
        {stateFormError.title && (
          <span className="warning">{stateFormError.title.hint}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="text">Descripcion</label>
        <textarea
          className="form-control"
          type="text"
          id="text"
          name="content"
          placeholder="Post Text"
          onChange={onChange}
          value={stateFormData.content.value}
        />
        {stateFormError.content && (
          <span className="warning">{stateFormError.content.hint}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="text">Date Start</label>
        <input
          className="form-control"
          type="date"
          id="text"
          name="dateStart"
          placeholder="Event Date Start"
          onChange={onChange}
          readOnly={loading && true}
          value={stateFormData.dateStart.value}
        />
        {stateFormError.dateStart && (
          <span className="warning">{stateFormError.dateStart.hint}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="text">Date End</label>
        <input
          className="form-control"
          type="date"
          id="text"
          name="dateEnd"
          placeholder="Event Date End"
          onChange={onChange}
          readOnly={loading && true}
          value={stateFormData.dateEnd.value}
        />
        {stateFormError.dateEnd && (
          <span className="warning">{stateFormError.dateEnd.hint}</span>
        )}
      </div>
      <div>
        <button
          type="submit"
          className="btn btn-block btn-warning"
          disabled={loading}
        >
          {!loading ? 'Submit' : 'Submitting...'}
        </button>
      </div>
    </form>
  );
}
export default FormEvent;