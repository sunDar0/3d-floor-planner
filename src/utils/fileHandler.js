export const downloadFloorPlan = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floor-plan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const uploadFloorPlan = (file, onSuccess, onError) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsed = JSON.parse(event.target.result);
            if (parsed.walls && parsed.rooms) {
                onSuccess(parsed);
            } else {
                onError("올바르지 않은 파일 형식입니다.");
            }
        } catch (err) {
            console.error(err);
            onError("파일을 읽는 중 오류가 발생했습니다.");
        }
    };
    reader.readAsText(file);
};
