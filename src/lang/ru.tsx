const ru = {
  appTitle: 'Video Meme Tool',
  step1: () => (
    <>
      Загрузи
      <br />
      видео
    </>
  ),
  step2: 'Редактируй ролик',
  step3: 'Опубликуй результат',
  uploadTitle: 'Перетащите или выберите файл',
  uploadDescription: 'Размер файла - 5 МБ. Формат - MP4',
  uploadButton: 'Выберите файл',
  uploadAlert: '* Загружая видеофайл, пользователь подтверждает наличие прав на его использование',
  uploadFileSize: ({ size }: { size: string }) => <>Размер файла {size} МБ</>,
  uploadFileRestriction: 'Разрешены только .mp4 видеофайлы',
  uploadButtonCancel: 'Отмена',
  uploadFileLoading: 'Файл загружается...',
  editAudioAdvice: 'Выделите фрагмент аудиодорожки и замените его новой репликой',
  phraseAdvice: 'Фраза',
  modeStretch: 'вписать',
  modeFill: 'заполнить',
  makeComplaint: 'Пожаловаться',
  complaintTitle: 'Жалоба на контент',
  complaintReason: 'Выберите причину',
  reasonOption1: 'Авторские права',
  reasonOption2: 'Другое',
  complaintEmail: 'Укажите обратный адрес',
  complaintText: 'Внесите описание',
  complaintSend: 'Отправить',
};

export { ru };
