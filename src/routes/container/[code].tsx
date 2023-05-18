import { useParams } from "solid-start";

export default function ContainerViewer() {

  const params = useParams<{ code: string }>();
  const decoded = atob(params.code)


  return (
    <p>{decoded}</p>
  );
}
